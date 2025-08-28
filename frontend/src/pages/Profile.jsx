// src/components/Pages/Profile.js
import React, { useState } from 'react';
import { User, Mail, Users, Copy, CheckCircle, Share2, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState({ code: false, link: false });

  // Generate referral link dynamically
  const getReferralLink = () => {
    if (!user?.referralCode) return null;
    return `${window.location.origin}/signup?ref=${user.referralCode}`;
  };

  const referralLink = getReferralLink();

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: 'Join me on this amazing platform!',
          text: 'Sign up using my referral link and let\'s get started together!',
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(referralLink, 'link');
      }
    } else if (referralLink) {
      copyToClipboard(referralLink, 'link');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {getInitials(user.name)}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
          <p className="text-gray-600">Welcome to your profile</p>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Name */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border">
            <div className="flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Referred By */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Referred By</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user.referredBy || 'Direct Signup'}
                </p>
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Your Referral Code</p>
                  <p className="text-lg font-semibold text-gray-800 font-mono">
                    {user.referralCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(user.referralCode, 'code')}
                className="ml-2 p-2 bg-white rounded-lg border hover:bg-purple-50 transition-colors"
                title="Copy referral code"
              >
                {copied.code ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-purple-600" />
                )}
              </button>
            </div>
            {copied.code && (
              <p className="text-sm text-green-600 mt-2">
                Referral code copied to clipboard!
              </p>
            )}
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-6 border">
          <div className="flex items-center mb-4">
            <LinkIcon className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Share Your Referral Link</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Invite friends and family by sharing your unique referral link. 
            When they sign up using your link, you'll both benefit!
          </p>

          <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Your Referral Link</span>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(referralLink, 'link')}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                  disabled={!referralLink}
                >
                  {copied.link ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={shareReferralLink}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  disabled={!referralLink}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-gray-700 font-mono text-sm break-all">
                {referralLink || 'Unable to generate referral link'}
              </p>
            </div>
            
            {copied.link && (
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Referral link copied to clipboard!
              </p>
            )}
          </div>

          {/* Quick Share Buttons */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Share:</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (referralLink) {
                    window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on this amazing platform! Sign up using my link: ${referralLink}`)}`, '_blank');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                disabled={!referralLink}
              >
                <span>📱</span>
                WhatsApp
              </button>
              
              <button
                onClick={() => {
                  if (referralLink) {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on this amazing platform! Sign up using my link: ${referralLink}`)}`, '_blank');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50"
                disabled={!referralLink}
              >
                <span>🐦</span>
                Twitter
              </button>
              
              <button
                onClick={() => {
                  if (referralLink) {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-50"
                disabled={!referralLink}
              >
                <span>📘</span>
                Facebook
              </button>
              
              <button
                onClick={() => {
                  if (referralLink) {
                    const subject = 'Join me on this amazing platform!';
                    const body = `Hi there!\n\nI wanted to invite you to join this amazing platform I've been using. Sign up using my referral link and we'll both benefit!\n\n${referralLink}\n\nHope to see you there!`;
                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50"
                disabled={!referralLink}
              >
                <span>✉️</span>
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;