import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Provider } from '../../types';
import { KarnatakaDistrictsMap } from '../map/KarnatakaDistrictsMap';
import {
  ShieldCheck,
  Users,
  Wrench,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  FolderPlus,
  Layers,
  Sparkles,
  CreditCard,
  MessageSquare,
  Search,
  MapPin,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    providers,
    categories,
    services,
    bookings,
    complaints,
    addProviderByAdmin,
    approveProvider,
    rejectProvider,
    toggleUserBlock,
    addCategory,
    deleteCategory,
    addService,
    deleteService,
    resolveComplaint,
    cancelBooking,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROVIDERS' | 'KARNATAKA_FLEET_MAP' | 'USERS' | 'SERVICES' | 'BOOKINGS' | 'COMPLAINTS'>('OVERVIEW');

  // Add Service Man Modal State
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [techName, setTechName] = useState('');
  const [techEmail, setTechEmail] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [techCategory, setTechCategory] = useState('CAT01');
  const [techExp, setTechExp] = useState('5+ Years');
  const [techLocation, setTechLocation] = useState('Davanagere (Vidyanagar & MCC B Block)');
  const [techPrice, setTechPrice] = useState(499);
  const [techVehicle, setTechVehicle] = useState('Honda Activa');
  const [techVehicleNo, setTechVehicleNo] = useState('KA-17-SM-2026');

  // Add Service Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [srvName, setSrvName] = useState('');
  const [srvCat, setSrvCat] = useState('CAT01');
  const [srvPrice, setSrvPrice] = useState(599);
  const [srvDuration, setSrvDuration] = useState('1-2 Hours');
  const [srvDesc, setSrvDesc] = useState('');

  // Add Category Modal State
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Search and pagination state for 1000+ Providers & Services
  const [providerSearch, setProviderSearch] = useState('');
  const [providerCityFilter, setProviderCityFilter] = useState<'ALL' | 'DAVANAGERE' | 'BENGALURU'>('ALL');
  const [providerStatusFilter, setProviderStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [providerPage, setProviderPage] = useState(1);
  const providerPageSize = 15;

  const [serviceSearch, setServiceSearch] = useState('');
  const [servicePage, setServicePage] = useState(1);
  const servicePageSize = 18;

  // Computed metrics
  const totalRevenue = bookings.filter((b) => b.payment_status === 'PAID').reduce((sum, b) => sum + (b.amount || 0), 0);
  const pendingApprovalsCount = providers.filter((p) => p.status === 'PENDING').length;
  const davanagereProsCount = providers.filter((p) => p.location.toLowerCase().includes('davanagere')).length;

  const handleAddTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName || !techEmail) return;

    addProviderByAdmin({
      name: techName,
      email: techEmail,
      phone: techPhone || '+91 98450 00000',
      category_id: techCategory,
      experience: techExp,
      location: techLocation,
      price: Number(techPrice),
      vehicle_type: techVehicle,
      vehicle_number: techVehicleNo,
      status: 'APPROVED',
    });

    setShowAddTechModal(false);
    setTechName('');
    setTechEmail('');
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName) return;

    addService({
      service_name: srvName,
      category_id: srvCat,
      price: Number(srvPrice),
      duration: srvDuration,
      description: srvDesc || 'Verified master service available for booking.',
      provider_id: providers[0]?.provider_id || 'PRV001',
    });

    setShowAddServiceModal(false);
    setSrvName('');
    setSrvDesc('');
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    addCategory({
      category_name: catName,
      description: catDesc || 'All-inclusive home and doorstep services.',
    });
    setShowAddCatModal(false);
    setCatName('');
    setCatDesc('');
  };

  const exportBookingsCSV = () => {
    const headers = ['Booking ID,User,Provider,Service,Amount,Status,Payment,Date'];
    const rows = bookings.map((b) =>
      `"${b.booking_id}","${b.user?.name || b.user_id}","${b.provider?.name || b.provider_id}","${b.service?.service_name || b.service_id}",${b.amount},"${b.status}","${b.payment_status}","${b.booking_date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ServiceMates_Bookings_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered providers list for admin
  const filteredAdminProviders = providers.filter((p) => {
    if (providerStatusFilter !== 'ALL' && p.status !== providerStatusFilter) return false;
    if (providerCityFilter === 'DAVANAGERE' && !p.location.toLowerCase().includes('davanagere')) return false;
    if (providerCityFilter === 'BENGALURU' && !p.location.toLowerCase().includes('bengaluru')) return false;
    if (providerSearch.trim()) {
      const q = providerSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.vehicle_number || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalProviderPages = Math.max(1, Math.ceil(filteredAdminProviders.length / providerPageSize));
  const currentProviderSlice = filteredAdminProviders.slice(
    (providerPage - 1) * providerPageSize,
    providerPage * providerPageSize
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin HQ Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-extrabold text-white">Central Admin Control HQ</h1>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs font-bold">
                Master SuperAdmin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Oversee multi-role operations, service catalog, approvals, revenue ledger, and grievance desk
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddTechModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Service Man</span>
          </button>
          <button
            onClick={exportBookingsCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Service Men</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{providers.length}+</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catalog Services</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{services.length}+</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Davanagere Pros</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{davanagereProsCount}+</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Revenue</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-sm">
          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Vetting</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingApprovalsCount}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Dashboard & Reports', icon: ShieldCheck },
          { id: 'PROVIDERS', label: `Service Men (${providers.length})`, icon: Wrench },
          { id: 'KARNATAKA_FLEET_MAP', label: 'Karnataka 31 Districts Google Map', icon: MapPin },
          { id: 'USERS', label: `Users (${users.length})`, icon: Users },
          { id: 'SERVICES', label: `Services & Categories`, icon: Layers },
          { id: 'BOOKINGS', label: `Master Bookings (${bookings.length})`, icon: Calendar },
          { id: 'COMPLAINTS', label: `Grievances (${complaints.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-2 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Pending Approvals Callout Banner */}
          {pendingApprovalsCount > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">
                    {pendingApprovalsCount} Service Technician(s) Awaiting Admin Vetting
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Newly registered service partners are not visible in public searches until approved.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('PROVIDERS')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap"
              >
                Review Applications
              </button>
            </div>
          )}

          {/* Recent Bookings Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base">Recent Platform Transactions</h3>
              <button
                onClick={() => setActiveTab('BOOKINGS')}
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.booking_id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">#{b.booking_id}</span>
                    <span className="text-slate-500 ml-2">{b.service?.service_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900">₹{b.amount}</span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE MEN & APPROVALS */}
      {activeTab === 'PROVIDERS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Service Providers & Technician Vetting</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage 1,050+ service personnel across Karnataka hubs</p>
            </div>
            <button
              onClick={() => setShowAddTechModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Service Man</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={providerSearch}
                onChange={(e) => {
                  setProviderSearch(e.target.value);
                  setProviderPage(1);
                }}
                placeholder="Search technician by name, phone, email, area, vehicle..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              />
            </div>
            <select
              value={providerStatusFilter}
              onChange={(e) => {
                setProviderStatusFilter(e.target.value as any);
                setProviderPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved Only</option>
              <option value="PENDING">Pending Vetting Only</option>
              <option value="REJECTED">Suspended / Rejected</option>
            </select>
            <select
              value={providerCityFilter}
              onChange={(e) => {
                setProviderCityFilter(e.target.value as any);
                setProviderPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="ALL">All Regions</option>
              <option value="DAVANAGERE">Davanagere Region</option>
              <option value="BENGALURU">Bengaluru Region</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentProviderSlice.map((p) => (
              <div
                key={p.provider_id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={p.profile_photo}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {p.location} • Experience: {p.experience} • Base: ₹{p.price}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      Vehicle: {p.vehicle_type} ({p.vehicle_number}) • {p.phone}
                    </p>
                  </div>
                </div>

                {/* Vetting Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {p.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => approveProvider(p.provider_id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm"
                      >
                        Approve Provider
                      </button>
                      <button
                        onClick={() => rejectProvider(p.provider_id)}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-xl"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {p.status === 'APPROVED' && (
                    <button
                      onClick={() => rejectProvider(p.provider_id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-xs font-semibold rounded-xl"
                    >
                      Suspend Access
                    </button>
                  )}
                  {p.status === 'REJECTED' && (
                    <button
                      onClick={() => approveProvider(p.provider_id)}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-xl"
                    >
                      Re-Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalProviderPages > 1 && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>
                Page {providerPage} of {totalProviderPages} ({filteredAdminProviders.length} Total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={providerPage === 1}
                  onClick={() => setProviderPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={providerPage === totalProviderPages}
                  onClick={() => setProviderPage((p) => Math.min(totalProviderPages, p + 1))}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: KARNATAKA 31 DISTRICTS GOOGLE MAP */}
      {activeTab === 'KARNATAKA_FLEET_MAP' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400 animate-bounce" />
                <h3 className="font-black text-base text-white">Karnataka Statewide Operations & Fleet Dispatch</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Google Maps Platform Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Live monitoring of all 31 administrative districts. Centered on the central Davanagere command hub (KA-17) and metropolitan zones.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                1,050+ Service Men
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                100% District Coverage
              </span>
            </div>
          </div>

          {/* Interactive Google Map Component */}
          <KarnatakaDistrictsMap showFullHeight={false} />
        </div>
      )}

      {/* TAB 3: USERS */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Registered Customer Accounts</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.user_id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5 text-slate-600">
                      {u.email} <br />
                      <span className="font-mono text-slate-400">{u.phone}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{u.city}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          u.blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {u.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => toggleUserBlock(u.user_id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          u.blocked
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {u.blocked ? 'Unblock' : 'Block User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES & CATEGORIES */}
      {activeTab === 'SERVICES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Service Catalog & Categories</h3>
              <p className="text-xs text-slate-500">Over 1,100 services indexed in platform database</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddCatModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>+ Add Category</span>
              </button>
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Service</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 18).map((s) => (
              <div
                key={s.service_id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <img src={s.image} alt={s.service_name} className="h-36 w-full object-cover" />
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{s.service_name}</h4>
                      <span className="font-extrabold text-slate-900">₹{s.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{s.duration}</span>
                    <button
                      onClick={() => deleteService(s.service_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MASTER BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Master Booking Records</h3>
            <button
              onClick={exportBookingsCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Technician</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.booking_id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-600">#{b.booking_id}</td>
                    <td className="p-3 font-semibold text-slate-800">{b.user?.name || b.user_id}</td>
                    <td className="p-3 text-slate-700">{b.service?.service_name}</td>
                    <td className="p-3 text-slate-600">{b.provider?.name || b.provider_id}</td>
                    <td className="p-3 font-extrabold text-slate-900">₹{b.amount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {b.status !== 'CANCELLED' && (
                        <button
                          onClick={() => cancelBooking(b.booking_id, 'Admin cancellation override')}
                          className="text-[11px] text-red-600 hover:underline font-semibold"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COMPLAINTS & GRIEVANCE DESK */}
      {activeTab === 'COMPLAINTS' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Customer Support & Grievance Desk</h3>
          <div className="grid grid-cols-1 gap-3">
            {complaints.map((c) => (
              <div key={c.complaint_id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{c.subject}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{c.message}</p>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400">By: {c.user_name} ({c.user_email})</span>
                  {c.status !== 'RESOLVED' && (
                    <button
                      onClick={() => resolveComplaint(c.complaint_id)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Service Man Modal */}
      {showAddTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-600" />
              <span>Admin Onboarding: Add Service Man</span>
            </h4>
            <form onSubmit={handleAddTechSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={techEmail}
                    onChange={(e) => setTechEmail(e.target.value)}
                    placeholder="ramesh@servicemates.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={techPhone}
                    onChange={(e) => setTechPhone(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Service Category
                  </label>
                  <select
                    value={techCategory}
                    onChange={(e) => setTechCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={techExp}
                    onChange={(e) => setTechExp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    value={techVehicle}
                    onChange={(e) => setTechVehicle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Vehicle Plate Number
                  </label>
                  <input
                    type="text"
                    value={techVehicleNo}
                    onChange={(e) => setTechVehicleNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTechModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Verify & Add Service Man
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Master Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Add Master Service to Catalog</h4>
            <form onSubmit={handleAddServiceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="e.g. Chimney Cleaning"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Add New Service Category</h4>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Wellness & Spa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
