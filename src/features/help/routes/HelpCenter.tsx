import React, {useState} from 'react';
import {Route, Routes, useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, BookOpen, MessageCircle, Star} from 'lucide-react';
import {HelpSearch} from '../components/HelpSearch';
import {CategoryCard} from '../components/CategoryCard';
import {ArticleCard} from '../components/ArticleCard';
import {HelpArticle} from '../components/HelpArticle';
import {ContactSupport} from '../components/ContactSupport';
import {
    getArticlesByCategory,
    getPopularArticles,
    helpArticles,
    helpCategories,
    searchArticles
} from '../data/helpData';

const HelpHome: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(helpArticles);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSearchResults(searchArticles(query));
    };

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/help/category/${categoryId}`);
    };

    const handleArticleClick = (articleId: string) => {
        navigate(`/help/article/${articleId}`);
    };

    const popularArticles = getPopularArticles(6);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <BookOpen className="w-12 h-12"/>
                        <h1 className="text-4xl font-bold">Help Center</h1>
                    </div>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Find answers, learn best practices, and get the most out of your Hapo CMS experience.
                    </p>
                    <HelpSearch onSearch={handleSearch}/>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {searchQuery ? (
                    /* Search Results */
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Search Results for "{searchQuery}"
                            </h2>
                            <span className="text-gray-500">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </span>
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {searchResults.map(article => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                        onClick={handleArticleClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <BookOpen className="w-16 h-16 mx-auto"/>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search terms or browse our categories below.
                                </p>
                                <button
                                    onClick={() => handleSearch('')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Default View */
                    <>
                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MessageCircle className="w-6 h-6 text-blue-600"/>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Need Personal Help?</h3>
                                        <p className="text-gray-600 text-sm">Contact our support team directly</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/help/contact')}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Contact Support
                                </button>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Star className="w-6 h-6 text-yellow-600"/>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Popular Articles</h3>
                                        <p className="text-gray-600 text-sm">Most helpful content from our community</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {popularArticles.slice(0, 3).map(article => (
                                        <button
                                            key={article.id}
                                            onClick={() => handleArticleClick(article.id)}
                                            className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {article.title}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {article.helpful} people found this helpful
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {helpCategories.map(category => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onClick={handleCategoryClick}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Popular Articles */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {popularArticles.map(article => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                        onClick={handleArticleClick}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const CategoryView: React.FC = () => {
    const {categoryId} = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    const category = helpCategories.find(cat => cat.id === categoryId);
    const articles = categoryId ? getArticlesByCategory(categoryId) : [];

    const handleArticleClick = (articleId: string) => {
        navigate(`/help/article/${articleId}`);
    };

    if (!category) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
                    <button
                        onClick={() => navigate('/help')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Help Center
                    </button>
                </div>
            </div>
        );
    }

    const IconComponent = category.icon;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/help')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    Back to Help Center
                </button>

                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-xl ${category.color}`}>
                            <IconComponent className="w-8 h-8 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                            <p className="text-gray-600 mt-2">{category.description}</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {articles.length} {articles.length === 1 ? 'article' : 'articles'} in this category
                    </div>
                </div>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map(article => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                onClick={handleArticleClick}
                                showCategory={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <BookOpen className="w-16 h-16 mx-auto"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
                        <p className="text-gray-600">
                            Articles for this category are coming soon.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ArticleView: React.FC = () => {
    const {articleId} = useParams<{ articleId: string }>();
    const navigate = useNavigate();

    const article = helpArticles.find(art => art.id === articleId);

    const handleFeedback = (articleId: string, isHelpful: boolean) => {
        // In a real app, this would make an API call
        console.log(`Article ${articleId} feedback: ${isHelpful ? 'helpful' : 'not helpful'}`);
        // You could show a toast notification here
    };

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
                    <button
                        onClick={() => navigate('/help')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Help Center
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/help')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    Back to Help Center
                </button>

                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <HelpArticle article={article} onFeedback={handleFeedback}/>
                </div>
            </div>
        </div>
    );
};

export const HelpCenter: React.FC = () => {
    return (
        <Routes>
            <Route index element={<HelpHome/>}/>
            <Route path="category/:categoryId" element={<CategoryView/>}/>
            <Route path="article/:articleId" element={<ArticleView/>}/>
            <Route path="contact" element={<ContactSupport/>}/>
        </Routes>
    );
};