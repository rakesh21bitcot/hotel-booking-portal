'use client'
import { useState, useEffect } from "react";
import { FaUser, FaLock, FaCog, FaBell, FaEnvelope, FaShieldAlt, FaGlobe, FaPalette, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { login as loginAction, updateUser } from "@/store/reducers/authReducer";
import { getProfile, updateProfile, updateProfileWithRedux, getSettings, updateSettings, changePassword, validateProfileData, validatePasswordData, validateSettingsData, ProfileData, SettingsData, ChangePasswordRequest } from "@/store/actions/profile-actions";
import { useAuth } from "../auth/hooks/useAuth";

const TABS = [
  { key: 'profile', label: 'Profile', icon: <FaUser /> },
  { key: 'changePassword', label: 'Change Password', icon: <FaLock /> },
  { key: 'settings', label: 'Settings', icon: <FaCog /> },
];

const HEADER_HEIGHT = 80;

export default function Profile() {
  const { isAuthenticated, user, logout } = useAuth()
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState('profile');

  console.log('Profile component - User from Redux:', user);
  console.log('Profile component - Is authenticated:', isAuthenticated);
console.log(user)
  // Profile states
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: 'MALE',
    dateOfBirth: '2001-12-01',
    nationality: 'India',
    state: 'Bihar',
    city: ''
  });
  const [picture, setPicture] = useState<string | null>(null);

  // Password states
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Settings states
  const [settingsData, setSettingsData] = useState<SettingsData>({
    notifications: true,
    emailNotifications: true,
    pushNotifications: false,
    bookingReminders: true,
    newsletter: true,
    offers: false,
    marketingEmails: false,
    twoFactorAuth: false,
    profileVisibility: 'public',
    dataSharing: true,
    currency: 'INR',
    language: 'en',
    theme: 'system'
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [settingsErrors, setSettingsErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { theme, setTheme, resolvedTheme } = useTheme();

  // Load profile and settings data on component mount
  useEffect(() => {
    if (user?.id) {
      loadProfileData();
      loadSettingsData();
    }
  }, [user?.id]);

  // Initialize user data from localStorage if Redux state is empty
  const initializeUserData = () => {
    if (!user && typeof window !== "undefined") {
      const cachedUser = localStorage.getItem("user_data");
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          // Update Redux state with cached data
          dispatch(updateUser({ user: parsedUser }));
          return parsedUser;
        } catch (error) {
          console.error('Failed to parse cached user data:', error);
        }
      }
    }
    return user;
  };

  // Refresh user data on page load/refresh
  useEffect(() => {
    const refreshUserData = async () => {
      const currentUser = initializeUserData();

      if (isAuthenticated && currentUser?.id) {
        try {
          // Always refresh user data when on profile page
          await loadProfileData();
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      }
    };

    refreshUserData();
  }, []); // Empty dependency array means this runs once on mount

  // Sync theme with settings
  useEffect(() => {
    setSettingsData(prev => ({ ...prev, theme }));
  }, [theme]);

  const loadProfileData = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      console.log('Loading profile data for user ID:', user.id);
      const profile = await getProfile(user.id);
      console.log('Fetched profile data:', profile);

      // Update Redux state and localStorage with fresh user data
      dispatch(updateUser({ user: profile }));
      console.log('Updated Redux state with profile data');

      // Also save to localStorage as backup
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(profile));
        console.log('Saved profile data to localStorage');
      }

      // Update local form state
      setProfileData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        gender: (profile as any).gender || 'MALE',
        dateOfBirth: (profile as any).dateOfBirth || '2001-12-01',
        nationality: (profile as any).nationality || 'India',
        state: (profile as any).state || 'Bihar',
        city: (profile as any).city || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      // If API fails, try to load from localStorage as fallback
      if (typeof window !== "undefined") {
        const cachedUser = localStorage.getItem("user_data");
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser);
            setProfileData({
              firstName: parsedUser.firstName || '',
              lastName: parsedUser.lastName || '',
              email: parsedUser.email || '',
              phone: parsedUser.phone || '',
              gender: parsedUser.gender || 'MALE',
              dateOfBirth: parsedUser.dateOfBirth || '2001-12-01',
              nationality: parsedUser.nationality || 'India',
              state: parsedUser.state || 'Bihar',
              city: parsedUser.city || ''
            });
          } catch (parseError) {
            console.error('Failed to parse cached user data:', parseError);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettingsData = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const settings = await getSettings(user.id);
      setSettingsData(settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Keep default settings if loading fails
    } finally {
      setIsLoading(false);
    }
  };

  // Form handlers
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setProfileErrors([]);
    setSuccessMessage('');

    const validationErrors = validateProfileData(profileData);
    if (validationErrors.length > 0) {
      setProfileErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const updatedUser = await dispatch(updateProfileWithRedux({
        id: user.id,
        ...profileData
      }));

      // Also update localStorage with the updated user data
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setProfileErrors([error.message || 'Failed to update profile']);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordErrors([]);
    setSuccessMessage('');

    const validationErrors = validatePasswordData(passwordData);
    if (validationErrors.length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setPasswordErrors([error.message || 'Failed to change password']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSettingsErrors([]);
    setSuccessMessage('');

    const validationErrors = validateSettingsData(settingsData);
    if (validationErrors.length > 0) {
      setSettingsErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      await updateSettings({
        userId: user.id,
        ...settingsData
      });

      // Update theme if changed
      if (settingsData.theme !== theme) {
        setTheme(settingsData.theme);
      }

      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setSettingsErrors([error.message || 'Failed to update settings']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (key: keyof SettingsData, value: any) => {
    setSettingsData(prev => ({ ...prev, [key]: value }));

    // Handle dependent settings
    if (key === 'notifications' && !value) {
      setSettingsData(prev => ({
        ...prev,
        [key]: value,
        emailNotifications: false,
        pushNotifications: false,
        bookingReminders: false
      }));
    }
  };
  console.log(user)
  // Manual refresh function for user data
  const refreshUserData = async () => {
    if (isAuthenticated && user?.id) {
      try {
        setIsLoading(true);
        await loadProfileData();
        setSuccessMessage('User data refreshed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        setSuccessMessage('Failed to refresh user data. Please try again.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen w-full bg-background text-foreground pt-24 sm:pt-28 md:pt-[100px] px-2 sm:px-4 md:px-0 pb-8 sm:pb-12 md:pb-16">
      {/* Banner/Profile Card - now darker style and with margin below fixed header */}
      <div className="relative bg-linear-to-r from-[#18181a] to-[#232326] h-[240px] sm:h-[220px] md:h-[200px] lg:h-[190px] shadow-lg mb-6 sm:mb-8 md:mb-10 rounded-b-xl flex items-end justify-center px-2 sm:px-4 pb-4 sm:pb-6 md:pb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 max-w-5xl w-full mx-auto relative z-10">
          {/* Avatar */}
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-full bg-primary/20 border-4 border-[#191919] overflow-hidden flex items-center justify-center shadow-lg">
              {picture ? (
                <img src={picture} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-[32px] sm:text-[38px] font-bold text-primary">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label className="text-xs text-primary font-medium cursor-pointer hover:underline mt-1">
              Add Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setPicture(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 md:ml-4 items-center sm:items-start pb-2 sm:pb-0">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 md:gap-4 text-muted-foreground">
              <span className="text-xs sm:text-sm">{user?.phone}</span>
              <span className="text-[10px] sm:text-xs">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sticky Sidebar Navigation — dark card */}
        <aside
          className="hidden lg:flex flex-col gap-2 w-72 bg-card shadow-xl border border-border rounded-2xl py-6 px-4"
          style={{
            position: 'sticky',
            top: HEADER_HEIGHT + 24,
            height: 'fit-content',
            alignSelf: 'flex-start',
            zIndex: 20,
          }}
        >
          <h3 className="uppercase text-[13px] text-muted-foreground px-1 mb-2 tracking-wider font-bold">MY ACCOUNT</h3>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={
                'flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-left ' +
                (activeTab === tab.key
                  ? 'bg-primary/20 text-primary border-primary border-2 shadow-md'
                  : 'text-foreground hover:text-primary hover:bg-primary/10 border border-transparent')
              }
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={activeTab === tab.key ? 'text-primary' : 'text-muted-foreground'}>{tab.icon}</span>
              {tab.label}
              {tab.key === 'profile' && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          ))}
          <hr className="my-5 border-border/40" />
          <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition border border-transparent">
            <FaLock className="text-lg" />
            <span>Reset Password</span>
          </button>
        </aside>

        {/* Mobile/Tablet sidebar top */}
        <aside className="flex lg:hidden flex-row gap-2 w-full bg-card shadow-xl rounded-xl mb-4 sm:mb-6 px-1 sm:px-2 py-2 sm:py-3 border border-border justify-center sticky top-20 sm:top-24 md:top-[100px] z-30">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={
                'flex flex-col items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold transition ' +
                (activeTab === tab.key
                  ? 'bg-primary/10 text-primary border border-primary'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5')
              }
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content — content fills available width */}
        <section className="flex-1 bg-card shadow-xl rounded-2xl border border-border p-4 sm:p-6 md:p-8 lg:p-10 w-full self-stretch flex flex-col">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 flex items-center gap-2 p-4 rounded-lg border border-green-500 bg-green-500/10 text-green-600">
              <FaCheck className="w-4 h-4" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Profile status callout - dark stylization */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-2">
            <div className="rounded-lg px-3 sm:px-4 md:px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border border-border bg-linear-to-r from-primary/10 to-black">
              <div className="font-medium text-foreground text-sm sm:text-base">
                <span className="font-bold text-primary">{profileData.city ? '100%' : '90%'}</span> Complete your profile
                <span className="block sm:inline sm:ml-2 text-[11px] sm:text-[12px] text-muted-foreground">
                  {profileData.city ? 'Your profile is complete!' : 'Fill in your City to get customized travel recommendations.'}
                </span>
              </div>
              <button
                onClick={refreshUserData}
                disabled={isLoading}
                className="text-primary font-semibold text-xs sm:text-sm underline whitespace-nowrap hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh user data from server"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              {!profileData.city && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-primary font-semibold text-xs sm:text-sm underline whitespace-nowrap"
                >
                  Add City of Residence
                </button>
              )}
            </div>
          </div>

          {activeTab === 'profile' && (
            <div className="w-full space-y-6">
                <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">General Information</h2>
                <p className="text-sm text-muted-foreground mb-6">Update your personal details and preferences</p>
              </div>
              
              {/* Profile Errors */}
              {profileErrors.length > 0 && (
                <div className="mb-6 p-4 rounded-lg border border-red-500 bg-red-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTimes className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-600">Please fix the following errors:</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {profileErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      First & Middle Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="h-11 text-sm font-medium"
                      placeholder="Enter your first name"
                    />
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="h-11 text-sm font-medium"
                      placeholder="Enter your last name"
                    />
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="h-11 text-sm bg-muted/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-11 text-sm"
                      placeholder="Enter your phone number"
                    />
                </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Gender
                    </Label>
                    <select
                      id="gender"
                      value={profileData.gender}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="h-11 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Nationality
                    </Label>
                    <select
                      id="nationality"
                      value={profileData.nationality}
                      onChange={(e) => setProfileData(prev => ({ ...prev, nationality: e.target.value }))}
                      className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      State / Province
                    </Label>
                    <select
                      id="state"
                      value={profileData.state}
                      onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="Bihar">Bihar</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Other">Other</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Required for GST purposes</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      City of Residence
                    </Label>
                    <select
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select City</option>
                      <option value="Patna">Patna</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Get customized travel recommendations</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        gender: 'MALE',
                        dateOfBirth: '2001-12-01',
                        nationality: 'India',
                        state: 'Bihar',
                        city: ''
                      });
                      setProfileErrors([]);
                    }}
                    className="px-6 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                    disabled={isLoading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password tab */}
          {activeTab === 'changePassword' && (
            <div className="w-full space-y-6">
                <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">Change Password</h2>
                <p className="text-sm text-muted-foreground mb-6">Update your password to keep your account secure</p>
              </div>
              
              {/* Password Errors */}
              {passwordErrors.length > 0 && (
                <div className="mb-6 p-4 rounded-lg border border-red-500 bg-red-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTimes className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-600">Please fix the following errors:</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form className="space-y-5 max-w-lg w-full" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="h-11 text-sm pr-10"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="h-11 text-sm pr-10"
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters with uppercase, lowercase, and numbers</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="h-11 text-sm pr-10"
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>
                
                <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground mb-2">Password Requirements:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${passwordData.newPassword.length >= 8 ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(passwordData.newPassword) ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(passwordData.newPassword) ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                      One number
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordErrors([]);
                    }}
                    className="px-6 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                    disabled={isLoading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="w-full space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your account preferences and privacy settings</p>
              </div>
              
              {/* Settings Errors */}
              {settingsErrors.length > 0 && (
                <div className="mb-6 p-4 rounded-lg border border-red-500 bg-red-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTimes className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-600">Please fix the following errors:</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {settingsErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form className="space-y-8" onSubmit={handleSettingsSubmit}>
                {/* Notifications Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <FaBell className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                  </div>

                  <div className="space-y-4 pl-8">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="notifications" className="text-sm font-semibold text-foreground cursor-pointer">
                          Enable Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Receive notifications about your bookings and account activity</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={settingsData.notifications}
                        onCheckedChange={(value) => handleSettingsChange('notifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="emailNotifications" className="text-sm font-semibold text-foreground cursor-pointer">
                          Email Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Get important updates via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settingsData.emailNotifications}
                        onCheckedChange={(value) => handleSettingsChange('emailNotifications', value)}
                        disabled={!settingsData.notifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="pushNotifications" className="text-sm font-semibold text-foreground cursor-pointer">
                          Push Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Receive real-time push notifications on your device</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={settingsData.pushNotifications}
                        onCheckedChange={(value) => handleSettingsChange('pushNotifications', value)}
                        disabled={!settingsData.notifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="bookingReminders" className="text-sm font-semibold text-foreground cursor-pointer">
                          Booking Reminders
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Get reminders before your check-in dates</p>
                      </div>
                      <Switch
                        id="bookingReminders"
                        checked={settingsData.bookingReminders}
                        onCheckedChange={(value) => handleSettingsChange('bookingReminders', value)}
                        disabled={!settingsData.notifications}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Email Preferences Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <FaEnvelope className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Email Preferences</h3>
                  </div>

                  <div className="space-y-4 pl-8">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="newsletter" className="text-sm font-semibold text-foreground cursor-pointer">
                          Newsletter
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Subscribe to our monthly newsletter with travel tips and news</p>
                      </div>
                      <Switch
                        id="newsletter"
                        checked={settingsData.newsletter}
                        onCheckedChange={(value) => handleSettingsChange('newsletter', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="offers" className="text-sm font-semibold text-foreground cursor-pointer">
                          Special Offers & Deals
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Receive exclusive offers and promotional emails</p>
                      </div>
                      <Switch
                        id="offers"
                        checked={settingsData.offers}
                        onCheckedChange={(value) => handleSettingsChange('offers', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="marketingEmails" className="text-sm font-semibold text-foreground cursor-pointer">
                          Marketing Emails
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Receive marketing communications and partner offers</p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={settingsData.marketingEmails}
                        onCheckedChange={(value) => handleSettingsChange('marketingEmails', value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Privacy & Security Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <FaShieldAlt className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
                  </div>

                  <div className="space-y-4 pl-8">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="twoFactorAuth" className="text-sm font-semibold text-foreground cursor-pointer">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={settingsData.twoFactorAuth}
                        onCheckedChange={(value) => handleSettingsChange('twoFactorAuth', value)}
                      />
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <Label htmlFor="profileVisibility" className="text-sm font-semibold text-foreground mb-2 block">
                        Profile Visibility
                      </Label>
                      <select
                        id="profileVisibility"
                        value={settingsData.profileVisibility}
                        onChange={(e) => handleSettingsChange('profileVisibility', e.target.value)}
                        className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="public">Public - Visible to everyone</option>
                        <option value="friends">Friends Only - Visible to connections</option>
                        <option value="private">Private - Only visible to you</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">Control who can see your profile information</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="dataSharing" className="text-sm font-semibold text-foreground cursor-pointer">
                          Data Sharing for Personalization
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Allow us to use your data to personalize your experience</p>
                      </div>
                      <Switch
                        id="dataSharing"
                        checked={settingsData.dataSharing}
                        onCheckedChange={(value) => handleSettingsChange('dataSharing', value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Regional Settings Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <FaGlobe className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Regional Settings</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pl-8">
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm font-semibold text-foreground">
                        Preferred Currency
                      </Label>
                      <select
                        id="currency"
                        value={settingsData.currency}
                        onChange={(e) => handleSettingsChange('currency', e.target.value)}
                        className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="GBP">GBP - British Pound (£)</option>
                        <option value="INR">INR - Indian Rupee (₹)</option>
                        <option value="JPY">JPY - Japanese Yen (¥)</option>
                        <option value="AUD">AUD - Australian Dollar (A$)</option>
                        <option value="CAD">CAD - Canadian Dollar (C$)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">Prices will be displayed in this currency</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-semibold text-foreground">
                        Language
                      </Label>
                      <select
                        id="language"
                        value={settingsData.language}
                        onChange={(e) => handleSettingsChange('language', e.target.value)}
                        className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="es">Español (Spanish)</option>
                        <option value="fr">Français (French)</option>
                        <option value="de">Deutsch (German)</option>
                        <option value="zh">中文 (Chinese)</option>
                        <option value="ja">日本語 (Japanese)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">Interface language preference</p>
                    </div>
                  </div>
                </div>

                {/* Appearance Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <FaPalette className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
                  </div>

                  <div className="pl-8">
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <Label htmlFor="theme" className="text-sm font-semibold text-foreground mb-2 block">
                        Theme
                      </Label>
                      <select
                        id="theme"
                        value={settingsData.theme}
                        onChange={(e) => handleSettingsChange('theme', e.target.value)}
                        className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">
                        Choose your preferred color theme
                        {settingsData.theme === "system" && (
                          <span className="block mt-1">Currently using: {resolvedTheme === "dark" ? "Dark" : "Light"} (System)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset to default settings
                      setSettingsData({
                        notifications: true,
                        emailNotifications: true,
                        pushNotifications: false,
                        bookingReminders: true,
                        newsletter: true,
                        offers: false,
                        marketingEmails: false,
                        twoFactorAuth: false,
                        profileVisibility: 'public',
                        dataSharing: true,
                        currency: 'INR',
                        language: 'en',
                        theme: 'system'
                      });
                      setSettingsErrors([]);
                    }}
                    className="px-6 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                    disabled={isLoading}
                  >
                    Reset to Defaults
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save All Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
