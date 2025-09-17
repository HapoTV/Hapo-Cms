#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

// File extensions to analyze
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Files and directories to ignore
const IGNORE_PATTERNS = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.vite',
    'coverage',
    '__tests__',
    '.test.',
    '.spec.',
    'vite-env.d.ts'
];

class UnusedCodeAnalyzer {
    constructor() {
        this.files = new Map();
        this.imports = new Map();
        this.exports = new Map();
        this.unusedFiles = [];
        this.unusedExports = [];
        this.unusedImports = [];
    }

    // Check if file should be ignored
    shouldIgnore(filePath) {
        return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
    }

    // Get all TypeScript/JavaScript files
    getAllFiles(dir) {
        const files = [];

        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !this.shouldIgnore(fullPath)) {
                files.push(...this.getAllFiles(fullPath));
            } else if (stat.isFile() && EXTENSIONS.includes(path.extname(item)) && !this.shouldIgnore(fullPath)) {
                files.push(fullPath);
            }
        }

        return files;
    }

    // Parse imports from a file
    parseImports(content, filePath) {
        const imports = [];

        // Match various import patterns
        const importPatterns = [
            // import { something } from 'module'
            /import\s*\{([^}]+)\}\s*from\s*['"`]([^'"`]+)['"`]/g,
            // import something from 'module'
            /import\s+(\w+)\s+from\s*['"`]([^'"`]+)['"`]/g,
            // import * as something from 'module'
            /import\s*\*\s*as\s+(\w+)\s+from\s*['"`]([^'"`]+)['"`]/g,
            // import 'module'
            /import\s*['"`]([^'"`]+)['"`]/g
        ];

        for (const pattern of importPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                if (match[2]) {
                    // Named or default imports
                    imports.push({
                        module: match[2],
                        names: match[1] ? match[1].split(',').map(s => s.trim()) : [],
                        type: 'named'
                    });
                } else {
                    // Side effect imports
                    imports.push({
                        module: match[1],
                        names: [],
                        type: 'side-effect'
                    });
                }
            }
        }

        return imports;
    }

    // Parse exports from a file
    parseExports(content, filePath) {
        const exports = [];

        // Match various export patterns
        const exportPatterns = [
            // export { something }
            /export\s*\{([^}]+)\}/g,
            // export const/let/var something
            /export\s+(const|let|var)\s+(\w+)/g,
            // export function something
            /export\s+function\s+(\w+)/g,
            // export class something
            /export\s+class\s+(\w+)/g,
            // export default
            /export\s+default\s+/g,
            // export interface/type
            /export\s+(interface|type)\s+(\w+)/g
        ];

        for (const pattern of exportPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                if (match[0].includes('default')) {
                    exports.push('default');
                } else if (match[2]) {
                    exports.push(match[2]);
                } else if (match[1]) {
                    // Named exports in braces
                    const names = match[1].split(',').map(s => s.trim());
                    exports.push(...names);
                }
            }
        }

        return exports;
    }

    // Analyze all files
    analyze() {
        console.log('🔍 Analyzing unused code...\n');

        const allFiles = this.getAllFiles(srcDir);
        console.log(`Found ${allFiles.length} files to analyze\n`);

        // Parse all files
        for (const filePath of allFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const relativePath = path.relative(projectRoot, filePath);

                this.files.set(relativePath, {
                    path: filePath,
                    content,
                    imports: this.parseImports(content, filePath),
                    exports: this.parseExports(content, filePath),
                    isUsed: false
                });
            } catch (error) {
                console.warn(`⚠️  Could not read file: ${filePath}`);
            }
        }

        // Mark files as used based on imports
        this.markUsedFiles();

        // Find unused files
        this.findUnusedFiles();

        // Find unused exports
        this.findUnusedExports();

        // Generate report
        this.generateReport();
    }

    // Mark files as used based on import relationships
    markUsedFiles() {
        // Always mark entry points as used
        const entryPoints = [
            'src/main.tsx',
            'src/App.tsx',
            'src/index.css',
            'vite.config.ts',
            'tailwind.config.js'
        ];

        for (const entry of entryPoints) {
            const file = this.files.get(entry);
            if (file) {
                file.isUsed = true;
                this.markImportsAsUsed(file);
            }
        }
    }

    // Recursively mark imported files as used
    markImportsAsUsed(file) {
        for (const importInfo of file.imports) {
            const importedFile = this.resolveImport(importInfo.module, file.path);
            if (importedFile && this.files.has(importedFile)) {
                const imported = this.files.get(importedFile);
                if (!imported.isUsed) {
                    imported.isUsed = true;
                    this.markImportsAsUsed(imported);
                }
            }
        }
    }

    // Resolve import path to actual file
    resolveImport(modulePath, fromFile) {
        if (modulePath.startsWith('.')) {
            // Relative import
            const fromDir = path.dirname(fromFile);
            const resolved = path.resolve(fromDir, modulePath);

            // Try different extensions
            for (const ext of EXTENSIONS) {
                const withExt = resolved + ext;
                const relativePath = path.relative(projectRoot, withExt);
                if (this.files.has(relativePath)) {
                    return relativePath;
                }
            }

            // Try index files
            for (const ext of EXTENSIONS) {
                const indexFile = path.join(resolved, 'index' + ext);
                const relativePath = path.relative(projectRoot, indexFile);
                if (this.files.has(relativePath)) {
                    return relativePath;
                }
            }
        }

        return null;
    }

    // Find unused files
    findUnusedFiles() {
        for (const [relativePath, file] of this.files) {
            if (!file.isUsed) {
                this.unusedFiles.push(relativePath);
            }
        }
    }

    // Find unused exports (simplified analysis)
    findUnusedExports() {
        for (const [filePath, file] of this.files) {
            if (!file.isUsed) continue;

            for (const exportName of file.exports) {
                let isUsed = false;

                // Check if this export is imported anywhere
                for (const [otherPath, otherFile] of this.files) {
                    if (otherPath === filePath) continue;

                    for (const importInfo of otherFile.imports) {
                        const resolvedPath = this.resolveImport(importInfo.module, otherFile.path);
                        if (resolvedPath === filePath) {
                            if (importInfo.names.includes(exportName) ||
                                (exportName === 'default' && importInfo.type === 'default')) {
                                isUsed = true;
                                break;
                            }
                        }
                    }

                    if (isUsed) break;
                }

                if (!isUsed && exportName !== 'default') {
                    this.unusedExports.push({
                        file: filePath,
                        export: exportName
                    });
                }
            }
        }
    }

    // Generate comprehensive report
    generateReport() {
        console.log('📊 UNUSED CODE ANALYSIS REPORT');
        console.log('================================\n');

        // Unused Files
        if (this.unusedFiles.length > 0) {
            console.log('🗑️  UNUSED FILES:');
            console.log('These files are not imported anywhere and can likely be deleted:\n');

            this.unusedFiles.forEach(file => {
                console.log(`   ❌ ${file}`);
            });
            console.log(`\n   Total: ${this.unusedFiles.length} unused files\n`);
        } else {
            console.log('✅ No unused files found!\n');
        }

        // Unused Exports
        if (this.unusedExports.length > 0) {
            console.log('📤 UNUSED EXPORTS:');
            console.log('These exports are not imported anywhere:\n');

            const groupedExports = {};
            this.unusedExports.forEach(({file, export: exportName}) => {
                if (!groupedExports[file]) {
                    groupedExports[file] = [];
                }
                groupedExports[file].push(exportName);
            });

            for (const [file, exports] of Object.entries(groupedExports)) {
                console.log(`   📁 ${file}:`);
                exports.forEach(exp => {
                    console.log(`      ❌ export ${exp}`);
                });
                console.log('');
            }
            console.log(`   Total: ${this.unusedExports.length} unused exports\n`);
        } else {
            console.log('✅ No unused exports found!\n');
        }

        // Package.json dependencies analysis
        this.analyzeDependencies();

        // Summary
        console.log('📋 SUMMARY:');
        console.log(`   • ${this.unusedFiles.length} unused files`);
        console.log(`   • ${this.unusedExports.length} unused exports`);
        console.log(`   • ${this.files.size} total files analyzed\n`);

        if (this.unusedFiles.length > 0) {
            console.log('💡 RECOMMENDATIONS:');
            console.log('   1. Review unused files before deleting');
            console.log('   2. Check if files are used in non-TypeScript contexts');
            console.log('   3. Consider if files are meant for future use');
            console.log('   4. Run tests after removing files\n');
        }
    }

    // Analyze package.json dependencies
    analyzeDependencies() {
        try {
            const packageJsonPath = path.join(projectRoot, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            const unusedDeps = [];

            for (const depName of Object.keys(allDeps)) {
                let isUsed = false;

                // Check if dependency is imported in any file
                for (const [, file] of this.files) {
                    for (const importInfo of file.imports) {
                        if (importInfo.module === depName || importInfo.module.startsWith(depName + '/')) {
                            isUsed = true;
                            break;
                        }
                    }
                    if (isUsed) break;
                }

                // Check for common build tools and configs
                const buildTools = [
                    'vite', 'typescript', 'eslint', '@vitejs', '@typescript-eslint',
                    'tailwindcss', 'postcss', 'autoprefixer', 'terser'
                ];

                if (buildTools.some(tool => depName.includes(tool))) {
                    isUsed = true;
                }

                if (!isUsed) {
                    unusedDeps.push(depName);
                }
            }

            if (unusedDeps.length > 0) {
                console.log('📦 POTENTIALLY UNUSED DEPENDENCIES:');
                console.log('These packages might not be used (review carefully):\n');

                unusedDeps.forEach(dep => {
                    console.log(`   ❌ ${dep}`);
                });
                console.log(`\n   Total: ${unusedDeps.length} potentially unused dependencies\n`);
            } else {
                console.log('✅ All dependencies appear to be used!\n');
            }

        } catch (error) {
            console.warn('⚠️  Could not analyze package.json dependencies');
        }
    }
}

// Run the analyzer
const analyzer = new UnusedCodeAnalyzer();
analyzer.analyze();