import React from 'react';
import {DivideIcon as LucideIcon} from 'lucide-react';

export interface Category {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    articleCount: number;
    color: string;
}

interface CategoryCardProps {
    category: Category;
    onClick: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({category, onClick}) => {
    const IconComponent = category.icon;

    return (
        <div
            onClick={() => onClick(category.id)}
            className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
        >
            <div className="flex items-start gap-4">
                <div
                    className={`p-3 rounded-lg ${category.color} group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-6 h-6 text-white"/>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                        {category.description}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                        {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
                    </div>
                </div>
            </div>
        </div>
    );
};