import { FiHeadphones, FiAward, FiUsers, FiTruck, FiStar, FiCheckCircle, FiPlay, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

export default function About() {
    const [activeTab, setActiveTab] = useState('mission');

    const stats = [
        { number: '10+', label: 'Years Experience', icon: FiAward },
        { number: '5000+', label: 'Happy Customers', icon: FiUsers },
        { number: '500+', label: 'Audio Equipment', icon: FiHeadphones },
        { number: '100+', label: 'Events Monthly', icon: FiTruck }
    ];

    const features = [
        {
            icon: FiHeadphones,
            title: 'Premium Equipment',
            description: 'Top-tier audio gear from leading brands like JBL, Bose, Shure, and Sennheiser.',
            color: 'from-indigo-500 to-purple-500'
        },
        {
            icon: FiTruck,
            title: 'Fast Delivery',
            description: 'Same-day delivery available for urgent events. We ensure your equipment arrives on time.',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            icon: FiUsers,
            title: 'Expert Support',
            description: 'Our technical team provides setup assistance and 24/7 support during your event.',
            color: 'from-amber-500 to-orange-500'
        },
        {
            icon: FiAward,
            title: 'Quality Guaranteed',
            description: 'All equipment is professionally maintained and tested before every rental.',
            color: 'from-pink-500 to-rose-500'
        }
    ];

    const team = [
        {
            name: 'Kamal Perera',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            bio: '15+ years in audio engineering'
        },
        {
            name: 'Nimal Silva',
            role: 'Technical Director',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            bio: 'Expert in live sound systems'
        },
        {
            name: 'Saman Fernando',
            role: 'Operations Manager',
            image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face',
            bio: 'Logistics & event coordination'
        },
        {
            name: 'Dilani Jayawardena',
            role: 'Customer Relations',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
            bio: 'Dedicated to client satisfaction'
        }
    ];

    const milestones = [
        { year: '2014', title: 'Company Founded', description: 'Started with just 20 pieces of equipment' },
        { year: '2016', title: 'First Major Event', description: 'Provided audio for a 5000+ attendee concert' },
        { year: '2018', title: 'Expanded Fleet', description: 'Grew to 200+ premium equipment pieces' },
        { year: '2020', title: 'Digital Transformation', description: 'Launched online booking platform' },
        { year: '2022', title: 'Island-wide Coverage', description: 'Extended services across Sri Lanka' },
        { year: '2024', title: '500+ Equipment', description: 'Became the largest audio rental service' }
    ];

    const testimonials = [
        {
            name: 'Ruwan Wickramasinghe',
            role: 'Event Organizer',
            content: 'Audio Manager transformed our corporate event. The sound quality was impeccable and the team was incredibly professional.',
            rating: 5
        },
        {
            name: 'Chamari Athapaththu',
            role: 'Wedding Planner',
            content: 'We\'ve been using their services for all our weddings. Reliable, punctual, and always exceeding expectations.',
            rating: 5
        },
        {
            name: 'Dinesh Priyantha',
            role: 'Music Producer',
            content: 'The quality of their equipment rivals professional studios. Highly recommend for any serious audio needs.',
            rating: 5
        }
    ];

    const tabContent = {
        mission: {
            title: 'Our Mission',
            content: 'To provide exceptional audio experiences that transform ordinary events into extraordinary memories. We believe every sound matters, and we\'re committed to delivering crystal-clear audio that captivates audiences and elevates every occasion.',
            points: [
                'Deliver premium audio solutions for all event sizes',
                'Maintain the highest standards of equipment quality',
                'Provide exceptional customer service and support',
                'Make professional audio accessible and affordable'
            ]
        },
        vision: {
            title: 'Our Vision',
            content: 'To be Sri Lanka\'s most trusted and innovative audio equipment rental service, setting the industry standard for quality, reliability, and customer satisfaction.',
            points: [
                'Lead the industry in audio technology adoption',
                'Expand our services across South Asia',
                'Build lasting relationships with our clients',
                'Continuously innovate our service offerings'
            ]
        },
        values: {
            title: 'Our Values',
            content: 'We are guided by principles that put our customers first and ensure we deliver excellence in everything we do.',
            points: [
                'Quality - Never compromise on equipment standards',
                'Reliability - Always deliver on our promises',
                'Innovation - Embrace new technologies',
                'Integrity - Honest and transparent dealings'
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                            <FiHeadphones className="text-indigo-400" />
                            <span className="text-indigo-400 text-sm font-medium">Since 2014</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            About <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Audio Manager</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Sri Lanka's premier audio equipment rental service, providing professional sound solutions 
                            for events of all sizes. From intimate gatherings to large-scale concerts, we deliver 
                            exceptional audio experiences.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:border-indigo-500/50 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <stat.icon className="text-indigo-400 text-3xl mx-auto mb-3" />
                                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.number}</h3>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mission/Vision/Values Tabs */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-20">
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {Object.keys(tabContent).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                        activeTab === tab
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                                    }`}
                                >
                                    {tabContent[tab].title}
                                </button>
                            ))}
                        </div>
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{tabContent[activeTab].title}</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">{tabContent[activeTab].content}</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {tabContent[activeTab].points.map((point, index) => (
                                    <div key={index} className="flex items-start gap-3 text-left bg-slate-700/30 rounded-xl p-4">
                                        <FiCheckCircle className="text-emerald-400 text-xl flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose Us?</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">We go beyond just renting equipment. We deliver complete audio solutions tailored to your needs.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="text-white text-2xl" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Our Journey Timeline */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Journey</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">From humble beginnings to becoming Sri Lanka's leading audio rental service.</p>
                        </div>
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 hidden lg:block"></div>
                            
                            <div className="space-y-8 lg:space-y-12">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className={`flex flex-col lg:flex-row items-center gap-4 lg:gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                        <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                            <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 inline-block ${index % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                                                <span className="text-indigo-400 font-bold text-lg">{milestone.year}</span>
                                                <h3 className="text-white font-semibold text-xl mt-1">{milestone.title}</h3>
                                                <p className="text-gray-400 mt-2">{milestone.description}</p>
                                            </div>
                                        </div>
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 ring-4 ring-slate-800 hidden lg:block"></div>
                                        <div className="flex-1 hidden lg:block"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">The passionate professionals behind Audio Manager's success.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, index) => (
                                <div 
                                    key={index}
                                    className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:border-indigo-500/50 transition-all duration-300"
                                >
                                    <div className="relative w-24 h-24 mx-auto mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="relative w-24 h-24 rounded-full object-cover border-2 border-slate-600 group-hover:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                                    <p className="text-indigo-400 text-sm font-medium mb-2">{member.role}</p>
                                    <p className="text-gray-400 text-sm">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">Don't just take our word for it. Here's what our customers have to say.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={index}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FiStar key={i} className="text-amber-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">{testimonial.name}</h4>
                                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="relative bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Elevate Your Event?</h2>
                            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                                Let us provide the perfect audio experience for your next event. 
                                Browse our equipment or get in touch with our team today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a 
                                    href="/items"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30"
                                >
                                    <FiHeadphones />
                                    Browse Equipment
                                </a>
                                <a 
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-600 hover:border-slate-500 transition-all"
                                >
                                    Contact Us
                                    <FiArrowRight />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}