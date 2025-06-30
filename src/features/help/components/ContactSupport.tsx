import React, {useState} from 'react';
import {CheckCircle, Mail, MessageCircle, Phone, Send} from 'lucide-react';

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
}

export const ContactSupport: React.FC = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleInputChange = (field: keyof ContactForm, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600"/>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                            priority: 'medium'
                        });
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Support</h1>
                <p className="text-lg text-gray-600">
                    Need help? We're here to assist you. Choose your preferred contact method below.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-6 h-6 text-blue-600"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-gray-600 text-sm mb-4">Get help via email within 24 hours</p>
                    <a
                        href="mailto:support@hapocloud.com"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        support@hapocloud.com
                    </a>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-6 h-6 text-green-600"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                    <p className="text-gray-600 text-sm mb-4">Speak with our team directly</p>
                    <a
                        href="tel:+1234567890"
                        className="text-green-600 hover:text-green-700 font-medium"
                    >
                        +1 (234) 567-890
                    </a>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-6 h-6 text-purple-600"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                    <p className="text-gray-600 text-sm mb-4">Chat with us in real-time</p>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                        Start Chat
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                placeholder="your.email@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                placeholder="Brief description of your issue"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                            placeholder="Please describe your issue in detail..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4"/>
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};