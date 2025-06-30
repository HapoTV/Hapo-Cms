import React from 'react';
import {Clock, Tag, User} from 'lucide-react';

export interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    author: string;
    createdAt: string;
    updatedAt: string;
    readTime: number;
    helpful: number;
    notHelpful: number;
}

interface HelpArticleProps {
    article: Article;
    onFeedback: (articleId: string, isHelpful: boolean) => void;
}

export const HelpArticle: React.FC<HelpArticleProps> = ({article, onFeedback}) => {
    return (
        <article className="max-w-4xl mx-auto">
            <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            {article.category}
          </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4"/>
                        <span>{article.readTime} min read</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <User className="w-4 h-4"/>
                        <span>{article.author}</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                    {article.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4"/>
                            <div className="flex gap-1">
                                {article.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="prose prose-lg max-w-none mb-8">
                <div dangerouslySetInnerHTML={{__html: article.content}}/>
            </div>

            <footer className="border-t pt-6">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Was this article helpful?
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onFeedback(article.id, true)}
                            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                            👍 Yes ({article.helpful})
                        </button>
                        <button
                            onClick={() => onFeedback(article.id, false)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            👎 No ({article.notHelpful})
                        </button>
                    </div>
                </div>
            </footer>
        </article>
    );
};