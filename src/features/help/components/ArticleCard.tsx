import React from 'react';
import {ArrowRight, Clock, User} from 'lucide-react';
import type {Article} from './HelpArticle';

interface ArticleCardProps {
    article: Article;
    onClick: (articleId: string) => void;
    showCategory?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
                                                            article,
                                                            onClick,
                                                            showCategory = true
                                                        }) => {
    return (
        <div
            onClick={() => onClick(article.id)}
            className="group cursor-pointer bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {showCategory && (
                        <span
                            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-3">
              {article.category}
            </span>
                    )}

                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {article.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4"/>
                            <span>{article.readTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4"/>
                            <span>{article.author}</span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                        {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                </div>

                <ArrowRight
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"/>
            </div>
        </div>
    );
};