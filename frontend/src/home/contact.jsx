import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare, FiCheckCircle, FiHeadphones, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: FiMapPin,
            title: 'Visit Us',
            details: ['123 Audio Street', 'Colombo 07, Sri Lanka'],
            color: 'from-indigo-500 to-purple-500'
        },
        {
            icon: FiPhone,
            title: 'Call Us',
            details: ['+94 11 234 5678', '+94 77 123 4567'],
            color: 'from-emerald-500 to-teal-500'
        },
        {
            icon: FiMail,
            title: 'Email Us',
            details: ['info@audiomanager.com', 'support@audiomanager.com'],
            color: 'from-amber-500 to-orange-500'
        },
        {
            icon: FiClock,
            title: 'Working Hours',
            details: ['Mon - Fri: 9AM - 6PM', 'Sat: 10AM - 4PM'],
            color: 'from-pink-500 to-rose-500'
        }
    ];

    const socialLinks = [
        { icon: FiFacebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: FiInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
        { icon: FiTwitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
        { icon: FiYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                            <FiHeadphones className="text-indigo-400" />
                            <span className="text-indigo-400 text-sm font-medium">Get In Touch</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Contact <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Us</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Have questions about our audio equipment rentals? We're here to help! 
                            Reach out and let's make your event sound amazing.
                        </p>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactInfo.map((info, index) => (
                            <div 
                                key={index}
                                className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <info.icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i} className="text-gray-400 text-sm">{detail}</p>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                            <p className="text-gray-400 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 animate-bounce">
                                        <FiCheckCircle className="text-white text-4xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-gray-400">Thank you for reaching out. We'll respond soon!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name *</label>
                                            <div className="relative">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className={`w-full bg-slate-700/50 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                                />
                                            </div>
                                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address *</label>
                                            <div className="relative">
                                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    className={`w-full bg-slate-700/50 border ${errors.email ? 'border-red-500' : 'border-slate-600'} rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Phone */}
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                                            <div className="relative">
                                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+94 77 123 4567"
                                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="rental">Equipment Rental</option>
                                                <option value="booking">Booking Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Message *</label>
                                        <div className="relative">
                                            <FiMessageSquare className="absolute left-4 top-4 text-gray-400" />
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us about your event and requirements..."
                                                rows={5}
                                                className={`w-full bg-slate-700/50 border ${errors.message ? 'border-red-500' : 'border-slate-600'} rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                                            />
                                        </div>
                                        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiSend className="text-xl" />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Map & Additional Info */}
                        <div className="space-y-8">
                            {/* Map */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                                <div className="aspect-video bg-slate-700/50 flex items-center justify-center">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467128219!2d79.8612428!3d6.9270786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591614a0e0db%3A0x1c3d81e63a0c3c5f!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '300px' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="grayscale hover:grayscale-0 transition-all duration-500"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                                <p className="text-gray-400 mb-6">Stay connected for the latest updates, offers, and audio tips!</p>
                                <div className="flex gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            aria-label={social.label}
                                            className={`w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-600 flex items-center justify-center text-gray-400 hover:text-white ${social.color} hover:border-transparent transition-all duration-300`}
                                        >
                                            <social.icon className="text-xl" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ Teaser */}
                            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-2">Have Questions?</h3>
                                <p className="text-gray-300 mb-4">Check out our frequently asked questions for quick answers about rentals, pricing, and more.</p>
                                <button className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                    View FAQ
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}