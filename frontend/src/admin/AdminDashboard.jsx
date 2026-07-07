import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

// Import static data files
import { blogs as staticBlogs } from '../data/blogs';
import { faqs as staticFaqs } from '../data/faqs';
import { testimonials as staticTestimonials } from '../data/testimonials';
import { team as staticTeam } from '../data/team';
import { services as staticServices } from '../data/services';
import { gallery as staticGallery } from '../data/gallery';
import { clientSuccess as staticSuccess } from '../data/clientSuccess';
import { homeContent as staticHome, aboutContent as staticAbout, siteSettings as staticSettings } from '../data/pageContent';
import {
  LayoutDashboard, BookOpen, Users, HelpCircle, FileText,
  Plus, Edit2, Trash2, Check, X, Download, Settings,
  Image as ImageIcon, Sparkles, ChevronUp, ChevronDown, LogOut, Play
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Stats data
  const [stats, setStats] = useState({
    consultations: 0,
    blogs: 0,
    testimonials: 0,
    gallery: 0,
    success: 0
  });

  // Data lists
  const [consultations, setConsultations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [team, setTeam] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [successStories, setSuccessStories] = useState([]);

  // Filter/Search states for Consultations
  const [consultationSearch, setConsultationSearch] = useState('');
  const [consultationStatus, setConsultationStatus] = useState('');
  const [consultationService, setConsultationService] = useState('');

  // CMS Homepage copy states
  const [cmsHome, setCmsHome] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    stats_claims_resolved: '',
    stats_patent_rate: '',
    stats_active_clients: '',
    stats_countries: '',
    why_choose_title: '',
    why_choose_desc: ''
  });

  // CMS About Us states
  const [cmsAbout, setCmsAbout] = useState({
    company_overview: '',
    vision: '',
    mission: '',
    history_timeline: []
  });
  const [newTimelineYear, setNewTimelineYear] = useState('');
  const [newTimelineEvent, setNewTimelineEvent] = useState('');

  // Services form state
  const [serviceName, setServiceName] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [serviceCategory, setServiceCategory] = useState('PATENT');
  const [serviceShortDesc, setServiceShortDesc] = useState('');
  const [serviceLongDesc, setServiceLongDesc] = useState('');
  const [serviceIcon, setServiceIcon] = useState('Scale');
  const [serviceDetailsList, setServiceDetailsList] = useState('');
  const [isEditingService, setIsEditingService] = useState(null);

  // Team form state
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamImageUrl, setTeamImageUrl] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamQualifications, setTeamQualifications] = useState('');
  const [teamExperience, setTeamExperience] = useState('');
  const [teamLinkedinUrl, setTeamLinkedinUrl] = useState('');
  const [teamTwitterUrl, setTeamTwitterUrl] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [isEditingTeam, setIsEditingTeam] = useState(null);

  // Blogs form state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('IPR Updates');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogSeoTitle, setBlogSeoTitle] = useState('');
  const [blogSeoDescription, setBlogSeoDescription] = useState('');
  const [blogStatus, setBlogStatus] = useState('DRAFT');
  const [isEditingBlog, setIsEditingBlog] = useState(null);

  // Gallery form state
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('EVENT');
  const [galleryOrder, setGalleryOrder] = useState(0);
  const [isEditingGallery, setIsEditingGallery] = useState(null);

  // Client Success form state
  const [successClientName, setSuccessClientName] = useState('');
  const [successPracticeArea, setSuccessPracticeArea] = useState('');
  const [successShortDesc, setSuccessShortDesc] = useState('');
  const [successOutcome, setSuccessOutcome] = useState('');
  const [successDate, setSuccessDate] = useState('');
  const [successImageUrl, setSuccessImageUrl] = useState('');
  const [isEditingSuccess, setIsEditingSuccess] = useState(null);

  // FAQ form state
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('General');
  const [faqOrder, setFaqOrder] = useState(0);
  const [isEditingFaq, setIsEditingFaq] = useState(null);

  // Videos List & Form States
  const [videos, setVideos] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoOrder, setVideoOrder] = useState(0);
  const [videoActive, setVideoActive] = useState(true);
  const [isEditingVideo, setIsEditingVideo] = useState(null);

  // Settings form state
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsHqAddress, setSettingsHqAddress] = useState('');
  const [settingsLiaisonAddress, setSettingsLiaisonAddress] = useState('');
  const [settingsCopyright, setSettingsCopyright] = useState('');
  const [settingsLinkedin, setSettingsLinkedin] = useState('');
  const [settingsTwitter, setSettingsTwitter] = useState('');
  const [settingsFacebook, setSettingsFacebook] = useState('');
  const [consultationDailyLimit, setConsultationDailyLimit] = useState(3);

  // Fetch all management records
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [consRes, videoRes, consultSettingsRes] = await Promise.all([
        API.get('consultations/'),
        API.get('videos/all').catch(() => ({ data: [] })),
        API.get('consultations/settings/').catch(() => ({ data: { dailyLimit: 3 } }))
      ]);

      setConsultations(consRes.data);
      setVideos(videoRes.data);
      setBlogs(staticBlogs);
      setFaqs(staticFaqs);
      setTestimonials(staticTestimonials);
      setTeam(staticTeam);
      setServices(staticServices);
      setGallery(staticGallery);
      setSuccessStories(staticSuccess);

      setCmsHome({
        hero_title: staticHome.hero_title || '',
        hero_subtitle: staticHome.hero_subtitle || '',
        hero_image: staticHome.hero_image || '',
        stats_claims_resolved: staticHome.stats_claims_resolved || '',
        stats_patent_rate: staticHome.stats_patent_rate || '',
        stats_active_clients: staticHome.stats_active_clients || '',
        stats_countries: staticHome.stats_countries || '',
        why_choose_title: staticHome.why_choose_title || '',
        why_choose_desc: staticHome.why_choose_desc || ''
      });

      setCmsAbout({
        company_overview: staticAbout.company_overview || '',
        vision: staticAbout.vision || '',
        mission: staticAbout.mission || '',
        history_timeline: staticAbout.history_timeline || []
      });

      setSettingsEmail(staticSettings.email || '');
      setSettingsPhone(staticSettings.phone || '');
      setSettingsHqAddress(staticSettings.hq_address || '');
      setSettingsLiaisonAddress(staticSettings.liaison_address || '');
      setSettingsCopyright(staticSettings.copyright || '');
      setSettingsLinkedin(staticSettings.linkedin_url || '');
      setSettingsTwitter(staticSettings.twitter_url || '');
      setSettingsFacebook(staticSettings.facebook_url || '');
      setConsultationDailyLimit(consultSettingsRes.data.dailyLimit || 3);

      setStats({
        consultations: consRes.data.length,
        blogs: staticBlogs.length,
        testimonials: staticTestimonials.length,
        gallery: staticGallery.length,
        success: staticSuccess.length,
        videos: videoRes.data.length
      });
    } catch (err) {
      console.error(err);
      showToast('Error syncing administrative records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // 1. Manage Consultations status/lawyer/notes updates
  const handleUpdateConsultationStatus = async (id, statusVal, lawyerVal, notesVal) => {
    try {
      await API.patch(`consultations/${id}/`, {
        status: statusVal,
        assigned_lawyer: lawyerVal,
        notes: notesVal
      });
      showToast('Consultation request updated.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to modify consultation status.', 'error');
    }
  };

  const handleDeleteConsultation = async (id) => {
    if (!window.confirm('Delete this consultation request permanently?')) return;
    try {
      await API.delete(`consultations/${id}/`);
      showToast('Consultation request deleted.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to delete consultation.', 'error');
    }
  };

  // 2. Manage Testimonial Approval (In-Memory Preview)
  const handleApproveTestimonial = (id, approvedStatus) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved: approvedStatus } : t));
    showToast(approvedStatus ? 'Testimonial approved (In-Memory Preview). Note: Edit testimonials.js for permanent changes.' : 'Testimonial hidden (In-Memory Preview). Note: Edit testimonials.js for permanent changes.', 'success');
  };

  // 3. Update Homepage CMS values (In-Memory Preview)
  const handleUpdateCmsHome = (e) => {
    e.preventDefault();
    showToast('Homepage copy updated (In-Memory Preview). Note: Edit pageContent.js for permanent changes.', 'success');
  };

  // 4. Update About Us CMS values (In-Memory Preview)
  const handleUpdateCmsAbout = (e) => {
    if (e) e.preventDefault();
    showToast('About Us copy updated (In-Memory Preview). Note: Edit pageContent.js for permanent changes.', 'success');
  };

  const handleAddTimelineItem = () => {
    if (!newTimelineYear || !newTimelineEvent) {
      showToast('Both Year and Event fields are required for timeline milestone.', 'warning');
      return;
    }
    const updatedTimeline = [...cmsAbout.history_timeline, { year: newTimelineYear, event: newTimelineEvent }];
    setCmsAbout({ ...cmsAbout, history_timeline: updatedTimeline });
    setNewTimelineYear('');
    setNewTimelineEvent('');
    showToast('Milestone added (In-Memory Preview). Note: Edit pageContent.js for permanent changes.', 'info');
  };

  const handleRemoveTimelineItem = (idx) => {
    const updatedTimeline = cmsAbout.history_timeline.filter((_, i) => i !== idx);
    setCmsAbout({ ...cmsAbout, history_timeline: updatedTimeline });
    showToast('Milestone removed (In-Memory Preview). Note: Edit pageContent.js for permanent changes.', 'info');
  };

  // Export consultations leads to CSV
  const handleExportCSV = () => {
    const accessToken = localStorage.getItem('access_token');
    window.open(`http://localhost:5000/api/consultations/export_csv/?token=${accessToken}`, '_blank');
  };

  const getFilteredConsultations = () => {
    return consultations.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(consultationSearch.toLowerCase()) || 
                            c.email.toLowerCase().includes(consultationSearch.toLowerCase()) ||
                            (c.company && c.company.toLowerCase().includes(consultationSearch.toLowerCase()));
      const matchesStatus = !consultationStatus || c.status === consultationStatus;
      const matchesService = !consultationService || c.service === consultationService;
      return matchesSearch && matchesStatus && matchesService;
    });
  };

  const filteredConsultations = getFilteredConsultations();

  // Service CRUD Handlers
  const handleSaveService = async (e) => {
    e.preventDefault();
    const servicePayload = {
      name: serviceName,
      slug: serviceSlug || undefined,
      category: serviceCategory,
      short_desc: serviceShortDesc,
      long_desc: serviceLongDesc || '',
      icon: serviceIcon || 'Scale',
      details_list: serviceDetailsList.split('\n').map(l => l.trim()).filter(Boolean)
    };

    if (isEditingService) {
      setServices(prev => prev.map(s => s.slug === isEditingService.slug ? servicePayload : s));
      showToast('Service updated (In-Memory Preview). Note: Edit services.js for permanent changes.', 'success');
    } else {
      setServices(prev => [...prev, servicePayload]);
      showToast('Service created (In-Memory Preview). Note: Edit services.js for permanent changes.', 'success');
    }
    resetServiceForm();
  };

  const handleDeleteService = (slug) => {
    if (!window.confirm('Delete this service permanently?')) return;
    setServices(prev => prev.filter(s => s.slug !== slug));
    showToast('Service deleted (In-Memory Preview). Note: Edit services.js for permanent changes.', 'success');
  };

  const resetServiceForm = () => {
    setServiceName('');
    setServiceSlug('');
    setServiceCategory('PATENT');
    setServiceShortDesc('');
    setServiceLongDesc('');
    setServiceIcon('Scale');
    setServiceDetailsList('');
    setIsEditingService(null);
  };

  const startEditService = (svc) => {
    setIsEditingService(svc);
    setServiceName(svc.name);
    setServiceSlug(svc.slug);
    setServiceCategory(svc.category);
    setServiceShortDesc(svc.short_desc);
    setServiceLongDesc(svc.long_desc || '');
    setServiceIcon(svc.icon || 'Scale');
    setServiceDetailsList(Array.isArray(svc.details_list) ? svc.details_list.join('\n') : '');
  };

  // Team CRUD Handlers
  const handleSaveTeamMember = async (e) => {
    e.preventDefault();
    const teamPayload = {
      name: teamName,
      role: teamRole,
      image_url: teamImageUrl || undefined,
      bio: teamBio,
      qualifications: teamQualifications || '',
      experience: teamExperience || '',
      linkedin_url: teamLinkedinUrl || undefined,
      twitter_url: teamTwitterUrl || undefined,
      email: teamEmail || undefined
    };

    if (isEditingTeam) {
      setTeam(prev => prev.map(t => t.id === isEditingTeam.id ? { ...teamPayload, id: isEditingTeam.id } : t));
      showToast('Team member updated (In-Memory Preview). Note: Edit team.js for permanent changes.', 'success');
    } else {
      setTeam(prev => [...prev, { ...teamPayload, id: Date.now() }]);
      showToast('Team member added (In-Memory Preview). Note: Edit team.js for permanent changes.', 'success');
    }
    resetTeamForm();
  };

  const handleDeleteTeamMember = (id) => {
    if (!window.confirm('Delete this lawyer profile permanently?')) return;
    setTeam(prev => prev.filter(t => t.id !== id));
    showToast('Team member deleted (In-Memory Preview). Note: Edit team.js for permanent changes.', 'success');
  };

  const resetTeamForm = () => {
    setTeamName('');
    setTeamRole('');
    setTeamImageUrl('');
    setTeamBio('');
    setTeamQualifications('');
    setTeamExperience('');
    setTeamLinkedinUrl('');
    setTeamTwitterUrl('');
    setTeamEmail('');
    setIsEditingTeam(null);
  };

  const startEditTeam = (tm) => {
    setIsEditingTeam(tm);
    setTeamName(tm.name);
    setTeamRole(tm.role);
    setTeamImageUrl(tm.image_url || '');
    setTeamBio(tm.bio || '');
    setTeamQualifications(tm.qualifications || '');
    setTeamExperience(tm.experience || '');
    setTeamLinkedinUrl(tm.linkedin_url || '');
    setTeamTwitterUrl(tm.twitter_url || '');
    setTeamEmail(tm.email || '');
  };

  // Blog CRUD Handlers
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const blogPayload = {
      title: blogTitle,
      slug: blogSlug || undefined,
      summary: blogSummary,
      content: blogContent,
      category: blogCategory,
      image_url: blogImageUrl || undefined,
      seo_title: blogSeoTitle || '',
      seo_description: blogSeoDescription || '',
      status: blogStatus
    };

    if (isEditingBlog) {
      setBlogs(prev => prev.map(b => b.slug === isEditingBlog.slug ? blogPayload : b));
      showToast('Blog article updated (In-Memory Preview). Note: Edit blogs.js for permanent changes.', 'success');
    } else {
      setBlogs(prev => [...prev, blogPayload]);
      showToast('Blog article saved (In-Memory Preview). Note: Edit blogs.js for permanent changes.', 'success');
    }
    resetBlogForm();
  };

  const handleDeleteBlog = (slug) => {
    if (!window.confirm('Delete this blog article permanently?')) return;
    setBlogs(prev => prev.filter(b => b.slug !== slug));
    showToast('Blog article deleted (In-Memory Preview). Note: Edit blogs.js for permanent changes.', 'success');
  };

  const resetBlogForm = () => {
    setBlogTitle('');
    setBlogSlug('');
    setBlogSummary('');
    setBlogContent('');
    setBlogCategory('IPR Updates');
    setBlogImageUrl('');
    setBlogSeoTitle('');
    setBlogSeoDescription('');
    setBlogStatus('DRAFT');
    setIsEditingBlog(null);
  };

  const startEditBlog = (bg) => {
    setIsEditingBlog(bg);
    setBlogTitle(bg.title);
    setBlogSlug(bg.slug);
    setBlogSummary(bg.summary || '');
    setBlogContent(bg.content || '');
    setBlogCategory(bg.category || 'IPR Updates');
    setBlogImageUrl(bg.image_url || '');
    setBlogSeoTitle(bg.seo_title || '');
    setBlogSeoDescription(bg.seo_description || '');
    setBlogStatus(bg.status || 'DRAFT');
  };

  // Gallery CRUD Handlers
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    const payload = {
      title: galleryTitle,
      description: galleryDescription,
      image_url: galleryImageUrl,
      category: galleryCategory,
      order: galleryOrder
    };

    if (isEditingGallery) {
      setGallery(prev => prev.map(g => g.id === isEditingGallery.id ? { ...payload, id: isEditingGallery.id } : g));
      showToast('Gallery item updated (In-Memory Preview). Note: Edit gallery.js for permanent changes.', 'success');
    } else {
      setGallery(prev => [...prev, { ...payload, id: Date.now() }]);
      showToast('Gallery item created (In-Memory Preview). Note: Edit gallery.js for permanent changes.', 'success');
    }
    resetGalleryForm();
  };

  const handleDeleteGallery = (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    setGallery(prev => prev.filter(g => g.id !== id));
    showToast('Gallery item deleted (In-Memory Preview). Note: Edit gallery.js for permanent changes.', 'success');
  };

  const resetGalleryForm = () => {
    setGalleryTitle('');
    setGalleryDescription('');
    setGalleryImageUrl('');
    setGalleryCategory('EVENT');
    setGalleryOrder(0);
    setIsEditingGallery(null);
  };

  const startEditGallery = (item) => {
    setIsEditingGallery(item);
    setGalleryTitle(item.title);
    setGalleryDescription(item.description || '');
    setGalleryImageUrl(item.image_url);
    setGalleryCategory(item.category);
    setGalleryOrder(item.order);
  };

  // Client Success CRUD Handlers
  const handleSaveSuccessStory = async (e) => {
    e.preventDefault();
    const payload = {
      client_name: successClientName || undefined,
      practice_area: successPracticeArea,
      short_description: successShortDesc,
      outcome: successOutcome,
      date: successDate,
      image_url: successImageUrl || undefined
    };

    if (isEditingSuccess) {
      setSuccessStories(prev => prev.map(s => s.id === isEditingSuccess.id ? { ...payload, id: isEditingSuccess.id } : s));
      showToast('Success story updated (In-Memory Preview). Note: Edit clientSuccess.js for permanent changes.', 'success');
    } else {
      setSuccessStories(prev => [...prev, { ...payload, id: Date.now() }]);
      showToast('Success story created (In-Memory Preview). Note: Edit clientSuccess.js for permanent changes.', 'success');
    }
    resetSuccessForm();
  };

  const handleDeleteSuccessStory = (id) => {
    if (!window.confirm('Delete this case study?')) return;
    setSuccessStories(prev => prev.filter(s => s.id !== id));
    showToast('Success story deleted (In-Memory Preview). Note: Edit clientSuccess.js for permanent changes.', 'success');
  };

  const resetSuccessForm = () => {
    setSuccessClientName('');
    setSuccessPracticeArea('');
    setSuccessShortDesc('');
    setSuccessOutcome('');
    setSuccessDate('');
    setSuccessImageUrl('');
    setIsEditingSuccess(null);
  };

  const startEditSuccess = (story) => {
    setIsEditingSuccess(story);
    setSuccessClientName(story.client_name || '');
    setSuccessPracticeArea(story.practice_area);
    setSuccessShortDesc(story.short_description);
    setSuccessOutcome(story.outcome);
    setSuccessDate(story.date);
    setSuccessImageUrl(story.image_url || '');
  };

  // FAQ CRUD Handlers
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    const payload = {
      question: faqQuestion,
      answer: faqAnswer,
      category: faqCategory,
      order: faqOrder
    };

    if (isEditingFaq) {
      setFaqs(prev => prev.map(f => f.id === isEditingFaq.id ? { ...payload, id: isEditingFaq.id } : f));
      showToast('FAQ updated (In-Memory Preview). Note: Edit faqs.js for permanent changes.', 'success');
    } else {
      setFaqs(prev => [...prev, { ...payload, id: Date.now() }]);
      showToast('FAQ created (In-Memory Preview). Note: Edit faqs.js for permanent changes.', 'success');
    }
    resetFaqForm();
  };

  const handleDeleteFaq = (id) => {
    if (!window.confirm('Delete this FAQ permanently?')) return;
    setFaqs(prev => prev.filter(f => f.id !== id));
    showToast('FAQ deleted (In-Memory Preview). Note: Edit faqs.js for permanent changes.', 'success');
  };

  const resetFaqForm = () => {
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('General');
    setFaqOrder(0);
    setIsEditingFaq(null);
  };

  const startEditFaq = (f) => {
    setIsEditingFaq(f);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category);
    setFaqOrder(f.order);
  };

  // Video CRUD Handlers
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl) {
      showToast('Title and YouTube URL are required.', 'warning');
      return;
    }

    const payload = {
      title: videoTitle,
      description: videoDescription,
      youtube_url: videoUrl,
      display_order: parseInt(videoOrder) || 0,
      is_active: videoActive
    };

    try {
      if (isEditingVideo) {
        await API.put(`videos/${isEditingVideo._id}`, payload);
        showToast('Video profile updated successfully.', 'success');
      } else {
        await API.post('videos', payload);
        showToast('Video profile added successfully.', 'success');
      }
      resetVideoForm();
      loadAdminData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.detail || 'Failed to save video profile.', 'error');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video profile permanently?')) return;
    try {
      await API.delete(`videos/${id}`);
      showToast('Video profile deleted.', 'success');
      loadAdminData();
    } catch (err) {
      console.error('Delete video error:', err.response?.data || err.message);
      showToast(err.response?.data?.detail || 'Failed to delete video. Make sure you are logged in as admin.', 'error');
    }
  };

  const handleToggleVideoStatus = async (video) => {
    try {
      await API.put(`videos/${video._id}`, { is_active: !video.is_active });
      showToast('Video visibility toggled.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to toggle video visibility.', 'error');
    }
  };

  const handleMoveVideo = async (video, direction) => {
    const currentIndex = videos.findIndex(v => v._id === video._id);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const targetVideo = videos[targetIndex];

    try {
      // Swap display_orders
      const currentOrder = video.display_order;
      const targetOrder = targetVideo.display_order;

      // Update both orders in parallel
      await Promise.all([
        API.put(`videos/${video._id}`, { display_order: targetOrder }),
        API.put(`videos/${targetVideo._id}`, { display_order: currentOrder })
      ]);

      showToast('Video order shifted.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to reorder videos.', 'error');
    }
  };

  const resetVideoForm = () => {
    setVideoTitle('');
    setVideoDescription('');
    setVideoUrl('');
    setVideoOrder(0);
    setVideoActive(true);
    setIsEditingVideo(null);
  };

  const startEditVideo = (v) => {
    setIsEditingVideo(v);
    setVideoTitle(v.title);
    setVideoDescription(v.description || '');
    setVideoUrl(v.youtube_url);
    setVideoOrder(v.display_order);
    setVideoActive(v.is_active);
  };

  // Settings Handlers
  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Global settings updated (In-Memory Preview). Note: Edit pageContent.js for permanent changes.', 'success');
  };

  const handleSaveConsultationLimit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.patch('consultations/settings/', {
        dailyLimit: consultationDailyLimit,
      });
      setConsultationDailyLimit(res.data.dailyLimit);
      showToast('Consultation booking limit updated.', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to update consultation limit.', 'error');
    }
  };

  const handleAdminLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await API.post('auth/logout/', { refresh: refreshToken });
    } catch (e) {
      console.error(e);
    }
    logout();
    window.location.href = '/';
  };

  return (
    <div className="font-sans min-h-screen bg-slate-50 dark:bg-navy-dark dark:text-slate-100 flex flex-col lg:flex-row">
      
      {/* 1. Left Sidebar menu */}
      <div className="w-full lg:w-64 bg-navy text-white border-r border-gold-dark/30 shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800 text-center">
            <h2 className="font-serif font-bold text-lg text-gold">Management Portal</h2>
            <p className="text-[10px] uppercase text-slate-400 mt-1">Real-time CMS Desk</p>
          </div>
          
          <nav className="p-4 space-y-1 text-sm font-semibold font-sans">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'overview' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <LayoutDashboard size={16} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('homepage_cms')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'homepage_cms' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <Settings size={16} /> Homepage copy CMS
            </button>
            <button
              onClick={() => setActiveTab('about_cms')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'about_cms' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <Settings size={16} /> About Us CMS
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'services' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <BookOpen size={16} /> Services Portfolio
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'team' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <Users size={16} /> Lawyer Roster
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'blogs' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <FileText size={16} /> Blogs CMS
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'gallery' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <ImageIcon size={16} /> Gallery CMS
            </button>
            <button
              onClick={() => setActiveTab('success_stories')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'success_stories' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <Sparkles size={16} /> Client Success
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'consultations' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <Users size={16} /> Consultation Requests
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'videos' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <Sparkles size={16} /> Manage YouTube Videos
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'faqs' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <HelpCircle size={16} /> FAQs CMS
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-4 py-2 rounded text-left transition-all ${activeTab === 'settings' ? 'bg-gold text-navy-dark' : 'hover:bg-navy-accent text-slate-300'}`}
            >
              <Settings size={16} /> Global Settings
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleAdminLogout} 
            className="w-full flex items-center justify-center gap-2 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded font-semibold text-sm transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* 2. Main Dashboard Content Frame */}
      <div className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {loading && (
          <div className="fixed inset-0 bg-slate-500/10 dark:bg-navy-dark/10 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Administrative Dashboard</h1>
            
            {/* Stats widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-5 rounded-lg shadow-sm">
                <div className="text-2xl font-serif font-bold text-gold">{stats.consultations}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-1">Consultation Requests</div>
              </div>
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-5 rounded-lg shadow-sm">
                <div className="text-2xl font-serif font-bold text-gold">{stats.blogs}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-1">Articles Published</div>
              </div>
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-5 rounded-lg shadow-sm">
                <div className="text-2xl font-serif font-bold text-gold">{stats.gallery}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-1">Gallery Highlights</div>
              </div>
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-5 rounded-lg shadow-sm">
                <div className="text-2xl font-serif font-bold text-gold">{stats.success}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-1">Success Stories</div>
              </div>
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-5 rounded-lg shadow-sm">
                <div className="text-2xl font-serif font-bold text-gold">{stats.testimonials}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-1">Testimonials</div>
              </div>
            </div>

            {/* Testimonials approvals */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-navy dark:text-white border-b pb-2">
                Testimonials Validation Desk
              </h2>
              {testimonials.length > 0 ? (
                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-slate-850 rounded text-xs gap-4">
                      <div>
                        <strong>{t.client_name}</strong> ({t.client_role} at {t.company})
                        <p className="text-slate-500 italic mt-0.5">"{t.feedback}"</p>
                      </div>
                      <div className="flex gap-2">
                        {t.approved ? (
                          <button
                            onClick={() => handleApproveTestimonial(t.id, false)}
                            className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded font-semibold hover:bg-amber-500/20"
                          >
                            Hide Review
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveTestimonial(t.id, true)}
                            className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded font-semibold hover:bg-emerald-500/20"
                          >
                            Approve Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">No client reviews registered.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: CMS Homepage copy */}
        {activeTab === 'homepage_cms' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Website Home Copy CMS</h1>
            
            <form onSubmit={handleUpdateCmsHome} className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm text-xs font-sans">
              
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">Hero Copy</h3>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Hero title</label>
                  <input
                    type="text"
                    value={cmsHome.hero_title}
                    onChange={(e) => setCmsHome({ ...cmsHome, hero_title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Hero subtitle</label>
                  <textarea
                    rows="3"
                    value={cmsHome.hero_subtitle}
                    onChange={(e) => setCmsHome({ ...cmsHome, hero_subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Hero background image URL</label>
                  <input
                    type="text"
                    value={cmsHome.hero_image}
                    onChange={(e) => setCmsHome({ ...cmsHome, hero_image: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">Statistics Benchmarks</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Claims Resolved</label>
                    <input
                      type="text"
                      value={cmsHome.stats_claims_resolved}
                      onChange={(e) => setCmsHome({ ...cmsHome, stats_claims_resolved: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Patent Allowance Rate</label>
                    <input
                      type="text"
                      value={cmsHome.stats_patent_rate}
                      onChange={(e) => setCmsHome({ ...cmsHome, stats_patent_rate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Active Tech Clients</label>
                    <input
                      type="text"
                      value={cmsHome.stats_active_clients}
                      onChange={(e) => setCmsHome({ ...cmsHome, stats_active_clients: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Countries Represented</label>
                    <input
                      type="text"
                      value={cmsHome.stats_countries}
                      onChange={(e) => setCmsHome({ ...cmsHome, stats_countries: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">Why Choose Us Copy</h3>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Why Choose Title</label>
                  <input
                    type="text"
                    value={cmsHome.why_choose_title}
                    onChange={(e) => setCmsHome({ ...cmsHome, why_choose_title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Why Choose Description</label>
                  <textarea
                    rows="3"
                    value={cmsHome.why_choose_desc}
                    onChange={(e) => setCmsHome({ ...cmsHome, why_choose_desc: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded shadow"
              >
                Save Homepage copy
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: CMS About Us copy */}
        {activeTab === 'about_cms' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">About Us Content CMS</h1>
            
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm text-xs font-sans">
              <form onSubmit={handleUpdateCmsAbout} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Company Overview</label>
                  <textarea
                    rows="4"
                    value={cmsAbout.company_overview}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, company_overview: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Vision Statement</label>
                  <textarea
                    rows="2"
                    value={cmsAbout.vision}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, vision: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Mission Statement</label>
                  <textarea
                    rows="2"
                    value={cmsAbout.mission}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, mission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded shadow"
                >
                  Save About Copy
                </button>
              </form>

              {/* History Timeline CMS */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">Firm History Timeline</h3>
                
                <div className="space-y-3">
                  {cmsAbout.history_timeline.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-slate-800 rounded">
                      <div>
                        <span className="font-bold text-gold text-sm mr-2">{item.year}</span>
                        <span className="text-slate-600 dark:text-slate-300">{item.event}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveTimelineItem(idx)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 border border-slate-200 dark:border-slate-800 rounded">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500">Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2026"
                      value={newTimelineYear}
                      onChange={(e) => setNewTimelineYear(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div className="sm:col-span-8 space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500">Milestone Event Details</label>
                    <input
                      type="text"
                      placeholder="Secured record biochemical patent approvals."
                      value={newTimelineEvent}
                      onChange={(e) => setNewTimelineEvent(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="w-full py-1.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold text-xs rounded hover:opacity-90 flex items-center justify-center gap-1"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Services CMS */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Services Portfolio CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Service list */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Active Practices</h2>
                <div className="grid grid-cols-1 gap-4">
                  {services.map((svc) => (
                    <div key={svc.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{svc.category}</span>
                        <h4 className="font-serif font-bold text-sm text-navy dark:text-white mt-0.5">{svc.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{svc.short_desc}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditService(svc)}
                          className="p-1.5 text-slate-500 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc.slug)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-5 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingService ? 'Edit Practice Area' : 'Add Practice Area'}
                </h3>
                <form onSubmit={handleSaveService} className="space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Service Title</label>
                    <input
                      type="text"
                      required
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="e.g. Patent Filing Strategy"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Slug (Optional)</label>
                      <input
                        type="text"
                        value={serviceSlug}
                        onChange={(e) => setServiceSlug(e.target.value)}
                        placeholder="e.g. patent-filing"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Category</label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      >
                        <option value="PATENT">Patent Services</option>
                        <option value="TRADEMARK">Trademark Services</option>
                        <option value="COPYRIGHT">Copyright Services</option>
                        <option value="DESIGN">Design Registration</option>
                        <option value="GI">Geographical Indication (GI)</option>
                        <option value="LITIGATION">Litigation & Enforcement</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Lucide Icon name</label>
                    <input
                      type="text"
                      value={serviceIcon}
                      onChange={(e) => setServiceIcon(e.target.value)}
                      placeholder="Scale, Cpu, Tags, ShieldAlert, etc."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Short description summary</label>
                    <textarea
                      required
                      rows="2"
                      value={serviceShortDesc}
                      onChange={(e) => setServiceShortDesc(e.target.value)}
                      placeholder="Brief overview shown in services lists..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Long description text</label>
                    <textarea
                      rows="4"
                      value={serviceLongDesc}
                      onChange={(e) => setServiceLongDesc(e.target.value)}
                      placeholder="In-depth details, methodology, and legal frameworks..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Sub-services checklist (One per line)</label>
                    <textarea
                      rows="3"
                      value={serviceDetailsList}
                      onChange={(e) => setServiceDetailsList(e.target.value)}
                      placeholder="e.g. Utility Patent Applications&#10;PCT International Filing"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded"
                    >
                      {isEditingService ? 'Save Service' : 'Create Service'}
                    </button>
                    {isEditingService && (
                      <button
                        type="button"
                        onClick={resetServiceForm}
                        className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Team Members CMS */}
        {activeTab === 'team' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Firm Attorneys CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Team list */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Attorney Roster</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.map((member) => (
                    <div key={member.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex flex-col justify-between gap-4 text-xs">
                      <div className="flex gap-3">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 dark:bg-navy text-slate-400 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <h4 className="font-serif font-bold text-sm text-navy dark:text-white">{member.name}</h4>
                          <p className="text-xs text-gold font-semibold">{member.role}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{member.experience} • {member.qualifications}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-3 italic">"{member.bio}"</p>
                      <div className="flex justify-between items-center border-t pt-2 border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] text-slate-450 truncate max-w-[150px]">{member.email}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditTeam(member)}
                            className="p-1 text-slate-500 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteTeamMember(member.id)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-5 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingTeam ? 'Edit Attorney Details' : 'Add New Attorney'}
                </h3>
                <form onSubmit={handleSaveTeamMember} className="space-y-4 font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Name</label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Siddharth Rao, Esq."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Role</label>
                      <input
                        type="text"
                        required
                        value={teamRole}
                        onChange={(e) => setTeamRole(e.target.value)}
                        placeholder="Senior Partner"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Experience</label>
                      <input
                        type="text"
                        value={teamExperience}
                        onChange={(e) => setTeamExperience(e.target.value)}
                        placeholder="e.g. 15+ Years"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Email Address</label>
                      <input
                        type="email"
                        value={teamEmail}
                        onChange={(e) => setTeamEmail(e.target.value)}
                        placeholder="s.rao@sr4ipr.com"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Qualifications</label>
                    <input
                      type="text"
                      value={teamQualifications}
                      onChange={(e) => setTeamQualifications(e.target.value)}
                      placeholder="e.g. LL.M. (Georgetown Law), B.Tech"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Image URL</label>
                    <input
                      type="text"
                      value={teamImageUrl}
                      onChange={(e) => setTeamImageUrl(e.target.value)}
                      placeholder="Image address URL"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">LinkedIn profile URL</label>
                      <input
                        type="text"
                        value={teamLinkedinUrl}
                        onChange={(e) => setTeamLinkedinUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Twitter profile URL</label>
                      <input
                        type="text"
                        value={teamTwitterUrl}
                        onChange={(e) => setTeamTwitterUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Biography</label>
                    <textarea
                      required
                      rows="4"
                      value={teamBio}
                      onChange={(e) => setTeamBio(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded"
                    >
                      {isEditingTeam ? 'Save Attorney' : 'Add Attorney'}
                    </button>
                    {isEditingTeam && (
                      <button
                        type="button"
                        onClick={resetTeamForm}
                        className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Blogs CMS */}
        {activeTab === 'blogs' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Blogs CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Blog list */}
              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Articles Directory</h2>
                <div className="space-y-3">
                  {blogs.map((bg) => (
                    <div key={bg.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex justify-between items-center gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-[3px] font-bold text-[9px] border ${
                            bg.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                          }`}>
                            {bg.status}
                          </span>
                          <span className="font-semibold text-slate-450">{bg.category}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-navy dark:text-white mt-1.5">{bg.title}</h4>
                        <p className="text-slate-500 line-clamp-1 mt-1 text-[11px]">{bg.summary}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditBlog(bg)}
                          className="p-1.5 text-slate-500 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(bg.slug)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-6 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingBlog ? 'Edit Article & SEO' : 'Compose New Article'}
                </h3>
                <form onSubmit={handleSaveBlog} className="space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Article Title</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="e.g. Navigating WIPO Patents"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Slug (Optional)</label>
                      <input
                        type="text"
                        value={blogSlug}
                        onChange={(e) => setBlogSlug(e.target.value)}
                        placeholder="e.g. navigating-wipo"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Category</label>
                      <input
                        type="text"
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        placeholder="e.g. Patents, News"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Image Cover URL</label>
                      <input
                        type="text"
                        value={blogImageUrl}
                        onChange={(e) => setBlogImageUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Publish Status</label>
                      <select
                        value={blogStatus}
                        onChange={(e) => setBlogStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300"
                      >
                        <option value="DRAFT">Draft (Save privately)</option>
                        <option value="PUBLISHED">Published (Go live instantly)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Short Summary</label>
                    <textarea
                      required
                      rows="2"
                      value={blogSummary}
                      onChange={(e) => setBlogSummary(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Article body (Markdown / HTML)</label>
                    <textarea
                      required
                      rows="8"
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy font-mono text-[11px]"
                    ></textarea>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy/40 p-4 rounded-md border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-[9px] tracking-wider uppercase font-bold text-gold">SEO Metadata</span>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">SEO Title</label>
                      <input
                        type="text"
                        value={blogSeoTitle}
                        onChange={(e) => setBlogSeoTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy text-xs border"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">SEO Description</label>
                      <textarea
                        rows="2"
                        value={blogSeoDescription}
                        onChange={(e) => setBlogSeoDescription(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy text-xs border"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded">
                      {isEditingBlog ? 'Save Article' : 'Publish Article'}
                    </button>
                    {isEditingBlog && (
                      <button type="button" onClick={resetBlogForm} className="px-4 py-2 border border-slate-300 rounded text-slate-500">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Gallery CMS */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Gallery CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Item List */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Active Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex flex-col justify-between gap-3 text-xs">
                      <div className="aspect-[4/3] w-full bg-slate-100 rounded overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] bg-gold/10 text-gold-dark dark:text-gold border border-gold-dark/20 px-2 py-0.5 rounded font-bold uppercase">{item.category}</span>
                        <h4 className="font-serif font-bold text-sm text-navy dark:text-white mt-1.5">{item.title}</h4>
                        <p className="text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                        <span className="block mt-1 font-mono text-[10px] text-slate-400">Sort Order: {item.order}</span>
                      </div>
                      <div className="flex justify-end gap-2 border-t pt-2 border-slate-100 dark:border-slate-850">
                        <button
                          onClick={() => startEditGallery(item)}
                          className="p-1.5 text-slate-550 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-5 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingGallery ? 'Edit Gallery Item' : 'Add Gallery Item'}
                </h3>
                <form onSubmit={handleSaveGallery} className="space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Title</label>
                    <input
                      type="text"
                      required
                      value={galleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                      placeholder="e.g. Best Law Firm Award"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Category</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                      >
                        <option value="AWARD">Award</option>
                        <option value="RECOGNITION">Recognition</option>
                        <option value="CERTIFICATE">Certificate</option>
                        <option value="EVENT">Event</option>
                        <option value="ACHIEVEMENT">Achievement</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Sort order index</label>
                      <input
                        type="number"
                        required
                        value={galleryOrder}
                        onChange={(e) => setGalleryOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Image URL</label>
                    <input
                      type="text"
                      required
                      value={galleryImageUrl}
                      onChange={(e) => setGalleryImageUrl(e.target.value)}
                      placeholder="Image URL link"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Description (Optional)</label>
                    <textarea
                      rows="3"
                      value={galleryDescription}
                      onChange={(e) => setGalleryDescription(e.target.value)}
                      placeholder="Brief details about the highlight..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded">
                      {isEditingGallery ? 'Save Item' : 'Create Item'}
                    </button>
                    {isEditingGallery && (
                      <button type="button" onClick={resetGalleryForm} className="px-4 py-2 border border-slate-300 rounded text-slate-500">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Client Success stories CMS */}
        {activeTab === 'success_stories' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Client Success CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Stories list */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Case Studies</h2>
                <div className="grid grid-cols-1 gap-4">
                  {successStories.map((story) => (
                    <div key={story.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex justify-between items-start gap-4 text-xs">
                      <div>
                        <span className="text-[10px] bg-gold/10 text-gold-dark dark:text-gold border px-2.5 py-0.5 rounded font-bold uppercase">{story.practice_area}</span>
                        <h4 className="font-serif font-bold text-sm text-navy dark:text-white mt-1.5">{story.client_name ? story.client_name : 'Anonymous Client'}</h4>
                        <p className="text-slate-500 mt-1 line-clamp-2"><strong>Challenge:</strong> {story.short_description}</p>
                        <p className="text-emerald-500 mt-1 font-semibold"><strong>Outcome:</strong> {story.outcome}</p>
                        <span className="block mt-2 text-[10px] text-slate-400">Date: {story.date}</span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditSuccess(story)}
                          className="p-1.5 text-slate-500 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteSuccessStory(story.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-5 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingSuccess ? 'Edit Success Story' : 'Add Success Story'}
                </h3>
                <form onSubmit={handleSaveSuccessStory} className="space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Client Name (Optional)</label>
                    <input
                      type="text"
                      value={successClientName}
                      onChange={(e) => setSuccessClientName(e.target.value)}
                      placeholder="e.g. Aether ML"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Practice Area</label>
                      <input
                        type="text"
                        required
                        value={successPracticeArea}
                        onChange={(e) => setSuccessPracticeArea(e.target.value)}
                        placeholder="e.g. Patent Prosecution"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550">Date Case Closed</label>
                      <input
                        type="date"
                        required
                        value={successDate}
                        onChange={(e) => setSuccessDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Featured image URL</label>
                    <input
                      type="text"
                      value={successImageUrl}
                      onChange={(e) => setSuccessImageUrl(e.target.value)}
                      placeholder="Image address URL"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Short Challenge Description</label>
                    <textarea
                      required
                      rows="3"
                      value={successShortDesc}
                      onChange={(e) => setSuccessShortDesc(e.target.value)}
                      placeholder="Summary of patent conflicts or trademark clearances needed..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Ultimate Outcome Achieved</label>
                    <textarea
                      required
                      rows="3"
                      value={successOutcome}
                      onChange={(e) => setSuccessOutcome(e.target.value)}
                      placeholder="Outcome details, approvals timeframes..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded">
                      {isEditingSuccess ? 'Save Story' : 'Create Story'}
                    </button>
                    {isEditingSuccess && (
                      <button type="button" onClick={resetSuccessForm} className="px-4 py-2 border border-slate-300 rounded text-slate-500">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Consultation Requests */}
        {activeTab === 'consultations' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2">
              <h1 className="text-3xl font-serif font-bold text-navy dark:text-white">Consultation Requests</h1>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 rounded text-xs font-semibold font-sans transition-all"
              >
                <Download size={14} /> Export Requests to CSV
              </button>
            </div>

            {/* Filter inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                value={consultationSearch}
                onChange={(e) => setConsultationSearch(e.target.value)}
                placeholder="Search requests by name / email / company..."
                className="px-3 py-2 text-xs bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm"
              />
              <select
                value={consultationStatus}
                onChange={(e) => setConsultationStatus(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm"
              >
                <option value="">Filter by Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONTACTED">Contacted</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select
                value={consultationService}
                onChange={(e) => setConsultationService(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-gold shadow-sm"
              >
                <option value="">Filter by Practice Area</option>
                <option value="Patent Prosecution">Patent Prosecution</option>
                <option value="Trademark Portfolio Management">Trademark Portfolio Management</option>
                <option value="Copyright Registration">Copyright Registration</option>
                <option value="Industrial Design Registration">Industrial Design Registration</option>
                <option value="Geographical Indication Registry">Geographical Indication Registry</option>
                <option value="IP Litigation & Enforcement">IP Litigation & Enforcement</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
            </div>

            {/* Leads Table List */}
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-navy border-b border-slate-200 dark:border-slate-800/80 uppercase text-slate-550 font-semibold text-slate-400">
                    <th className="p-3">Client details</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Schedule details</th>
                    <th className="p-3">Practice Area</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned lawyer</th>
                    <th className="p-3">Notes</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredConsultations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-navy/20">
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</div>
                        <div className="text-[10px] text-slate-450">{c.email} • {c.phone}</div>
                        {c.message && <div className="text-[10px] text-slate-500 mt-1 max-w-[250px] truncate" title={c.message}>"{c.message}"</div>}
                      </td>
                      <td className="p-3 font-semibold text-slate-600 dark:text-slate-350">{c.company || 'N/A'}</td>
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-350">{c.date} • {c.time}</td>
                      <td className="p-3 font-semibold text-gold-dark dark:text-gold">{c.service}</td>
                      <td className="p-3">
                        <select
                          value={c.status}
                          onChange={(e) => handleUpdateConsultationStatus(c.id, e.target.value, c.assigned_lawyer, c.notes)}
                          className="px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-[11px]"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          defaultValue={c.assigned_lawyer || ''}
                          onBlur={(e) => handleUpdateConsultationStatus(c.id, c.status, e.target.value, c.notes)}
                          placeholder="Assign lawyer"
                          className="px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-[11px] w-28"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          defaultValue={c.notes || ''}
                          onBlur={(e) => handleUpdateConsultationStatus(c.id, c.status, c.assigned_lawyer, e.target.value)}
                          placeholder="Internal Notes"
                          className="px-2 py-1 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded text-[11px] w-36"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteConsultation(c.id)}
                          className="p-1 text-rose-500 hover:bg-rose-550/10 border border-rose-500/10 rounded"
                          title="Delete Request"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 10: FAQ CMS */}
        {activeTab === 'faqs' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">FAQs CMS</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* FAQ list */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-lg font-serif font-bold text-navy dark:text-white">Active FAQs</h2>
                <div className="grid grid-cols-1 gap-4">
                  {faqs.map((f) => (
                    <div key={f.id} className="p-4 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex justify-between items-start gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{f.category}</span>
                          <span className="font-mono text-[9px] text-slate-400">Order: {f.order}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-navy dark:text-white mt-1.5">{f.question}</h4>
                        <p className="text-slate-500 mt-1 line-clamp-2">{f.answer}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditFaq(f)}
                          className="p-1.5 text-slate-550 hover:text-gold rounded border border-slate-200 dark:border-slate-800"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(f.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded border border-rose-500/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Form */}
              <div className="lg:col-span-5 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-navy dark:text-white border-b pb-2">
                  {isEditingFaq ? 'Edit FAQ Item' : 'Add FAQ Item'}
                </h3>
                <form onSubmit={handleSaveFaq} className="space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550">Question</label>
                    <input
                      type="text"
                      required
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="e.g. How long does trademark clearance take?"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-555">Category</label>
                      <input
                        type="text"
                        required
                        value={faqCategory}
                        onChange={(e) => setFaqCategory(e.target.value)}
                        placeholder="e.g. General, Patent"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-555">Reorder Index</label>
                      <input
                        type="number"
                        required
                        value={faqOrder}
                        onChange={(e) => setFaqOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-555">Answer Details</label>
                    <textarea
                      required
                      rows="5"
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="Provide precise answer explanation..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 rounded"
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow py-2 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded">
                      {isEditingFaq ? 'Save FAQ' : 'Create FAQ'}
                    </button>
                    {isEditingFaq && (
                      <button type="button" onClick={resetFaqForm} className="px-4 py-2 border border-slate-300 rounded text-slate-500">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 11: Site & Footer Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-serif font-bold text-navy dark:text-white border-b pb-2">Global Site Settings</h1>
            
            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-lg shadow-sm max-w-3xl">
              <form onSubmit={handleSaveConsultationLimit} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550 font-sans">Daily Consultation Booking Limit</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={consultationDailyLimit}
                    onChange={(e) => setConsultationDailyLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gold text-navy-dark font-bold rounded shadow hover:opacity-90"
                >
                  Save Consultation Limit
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-lg shadow-sm max-w-3xl">
              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-sans">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-550 font-sans">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      placeholder="consult@sr4ipr.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-555 font-sans">Contact Phone / Helpline</label>
                    <input
                      type="text"
                      required
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      placeholder="+91 22 5543-0980"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-555 font-sans">Corporate Headquarters Address</label>
                  <input
                    type="text"
                    required
                    value={settingsHqAddress}
                    onChange={(e) => setSettingsHqAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-555 font-sans">Liaison Office Address</label>
                  <input
                    type="text"
                    required
                    value={settingsLiaisonAddress}
                    onChange={(e) => setSettingsLiaisonAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-555 font-sans">Footer Copyright Text</label>
                  <input
                    type="text"
                    required
                    value={settingsCopyright}
                    onChange={(e) => setSettingsCopyright(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-navy/40 p-4 rounded-md border border-slate-200 dark:border-slate-800 space-y-4">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-gold font-serif">Social Media Links</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-450">LinkedIn URL</label>
                      <input
                        type="url"
                        value={settingsLinkedin}
                        onChange={(e) => setSettingsLinkedin(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-455">Twitter URL</label>
                      <input
                        type="url"
                        value={settingsTwitter}
                        onChange={(e) => setSettingsTwitter(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-455">Facebook URL</label>
                      <input
                        type="url"
                        value={settingsFacebook}
                        onChange={(e) => setSettingsFacebook(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-navy border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded shadow hover:opacity-90"
                >
                  Save Global Site Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 12: Manage YouTube Videos */}
        {activeTab === 'videos' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2">
              <div>
                <h1 className="text-3xl font-serif font-bold text-navy dark:text-white">YouTube Video Carousel</h1>
                <p className="text-xs text-slate-400 mt-1">Manage links, titles, descriptions, and ordering for home page player cards</p>
              </div>
              <button
                onClick={resetVideoForm}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-navy-accent dark:hover:bg-navy-accent/80 text-navy dark:text-gold text-xs font-bold rounded"
              >
                Clear Form / Add New
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Form Side */}
              <div className="bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm h-fit">
                <h2 className="font-serif font-bold text-lg text-gold mb-4 font-serif">
                  {isEditingVideo ? 'Edit Video Details' : 'Add New YouTube Video'}
                </h2>
                
                <form onSubmit={handleSaveVideo} className="space-y-4 text-xs font-sans">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Video Title</label>
                    <input
                      type="text"
                      required
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="e.g. Navigating PCT Patent Filing"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">YouTube URL</label>
                    <input
                      type="url"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded dark:text-white"
                    />
                    <p className="text-[9px] text-slate-400">Accepts share (youtu.be), watch, embed, or shorts link formats.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Display Order</label>
                      <input
                        type="number"
                        required
                        value={videoOrder}
                        onChange={(e) => setVideoOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded dark:text-white"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[10px] uppercase text-slate-550">
                        <input
                          type="checkbox"
                          checked={videoActive}
                          onChange={(e) => setVideoActive(e.target.checked)}
                          className="rounded border-slate-300 text-gold focus:ring-gold"
                        />
                        Is Active
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Short Description</label>
                    <textarea
                      rows="3"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Enter an optional brief overview..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-navy border border-slate-300 dark:border-slate-700 rounded dark:text-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-navy dark:bg-gold text-white dark:text-navy-dark font-bold rounded shadow hover:opacity-90 transition-opacity"
                  >
                    {isEditingVideo ? 'Update Video Profile' : 'Add Video to Library'}
                  </button>

                  {isEditingVideo && (
                    <button
                      type="button"
                      onClick={resetVideoForm}
                      className="w-full py-2 border border-slate-300 dark:border-slate-700 rounded text-slate-500 hover:bg-slate-50 dark:hover:bg-navy/30 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}

                </form>
              </div>

              {/* Data Table Side */}
              <div className="xl:col-span-2 bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
                <h2 className="font-serif font-bold text-lg text-gold mb-4">Current Video Collection</h2>
                
                {videos.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded text-xs text-slate-400 uppercase tracking-widest">
                    No videos registered in database
                  </div>
                ) : (
                  <div className="overflow-x-auto text-xs font-sans">
                    <table className="w-full text-left border-collapse font-sans">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          <th className="pb-3 pl-2">Display Order</th>
                          <th className="pb-3">Preview</th>
                          <th className="pb-3">Title / Description</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {videos.map((vid, idx) => (
                          <tr key={vid._id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-navy/20">
                            <td className="py-4 font-bold text-navy dark:text-gold pl-2">
                              <div className="flex items-center gap-1.5">
                                <span>{vid.display_order}</span>
                                <div className="flex flex-col">
                                  <button
                                    onClick={() => handleMoveVideo(vid, 'up')}
                                    disabled={idx === 0}
                                    title="Move Up"
                                    className="text-slate-400 hover:text-gold disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                  >
                                    <ChevronUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleMoveVideo(vid, 'down')}
                                    disabled={idx === videos.length - 1}
                                    title="Move Down"
                                    className="text-slate-400 hover:text-gold disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                  >
                                    <ChevronDown size={12} />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-3">
                              <div className="relative w-20 aspect-video rounded overflow-hidden bg-black/20 border border-slate-200 dark:border-slate-800">
                                <img
                                  src={`https://img.youtube.com/vi/${vid.youtube_video_id}/mqdefault.jpg`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                  <Play size={10} className="text-white fill-current" />
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="font-bold text-[#171717] dark:text-white">{vid.title}</div>
                              <div className="text-slate-400 max-w-xs truncate mt-0.5">{vid.description || 'No description provided.'}</div>
                              <a
                                href={vid.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline text-[10px] mt-1 inline-block truncate max-w-xs"
                              >
                                {vid.youtube_url}
                              </a>
                            </td>
                            <td className="py-4">
                              <button
                                onClick={() => handleToggleVideoStatus(vid)}
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${vid.is_active ? 'bg-emerald-550/10 text-emerald-400' : 'bg-rose-550/10 text-rose-400'}`}
                              >
                                {vid.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </button>
                            </td>
                            <td className="py-4 text-right pr-2">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => startEditVideo(vid)}
                                  title="Edit Video"
                                  className="p-1.5 bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 rounded transition-all cursor-pointer"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(vid._id)}
                                  title="Delete Video"
                                  className="p-1.5 bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 rounded transition-all cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
