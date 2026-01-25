"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert, Chip, TextField, Select, MenuItem, 
  FormControl, InputLabel, Button, IconButton, Pagination, Stack, Grid, Collapse,
  Card, CardContent, Switch, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageSwitcher from "../components/LanguageSwitcher";
import { 
  getLogs, 
  checkAdminAccess,
  getAdminUsers,
  updateUserAdminStatus,
  deleteAdminUser,
  getSystemStats,
  getAdminAquariums,
  deleteAdminAquarium,
  getAdminFish,
  deleteAdminFish,
  getAdminPlants,
  deleteAdminPlant
} from "../lib/api";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPanelPage() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Stan dla zarządzania danymi systemowymi
  const [systemDataView, setSystemDataView] = useState(null); // null, 'aquariums', 'fish', 'plants'
  const [allAquariums, setAllAquariums] = useState([]);
  const [allFish, setAllFish] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [aquariumDeleteDialog, setAquariumDeleteDialog] = useState(false);
  const [fishDeleteDialog, setFishDeleteDialog] = useState(false);
  const [plantDeleteDialog, setPlantDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Upewnij się, że komponent jest zamontowany przed renderowaniem tłumaczeń
  useEffect(() => {
    setMounted(true);
  }, []);

  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]); // Wszystkie logi przed filtrowaniem
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Wszystkie użytkownicy przed filtrowaniem
  const [systemData, setSystemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  
  // Filtry dla użytkowników
  const [userSearchFilter, setUserSearchFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all'); // 'all' | 'admins' | 'regular'
  const [userPage, setUserPage] = useState(1);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  
  // Dialogi
  const [userDetailsDialog, setUserDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Filtry i sortowanie
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Paginacja
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Sprawdzenie uprawnień administratora przy pierwszym załadowaniu
  useEffect(() => {
    async function checkAccess() {
      if (!session?.user?.id) {
        setError(t('adminLoginRequired', { defaultValue: 'Musisz być zalogowany, aby uzyskać dostęp do panelu administratora' }));
        setIsAdmin(false);
        setAccessChecked(true);
        setIsLoading(false);
        return;
      }

      try {
        const hasAdminAccess = await checkAdminAccess(session.user.id);
        setIsAdmin(hasAdminAccess);
        
        if (!hasAdminAccess) {
          setError(t('adminNoAccess', { defaultValue: 'Brak uprawnień administratora. Dostęp do panelu administratora jest ograniczony.' }));
          setIsLoading(false);
        } else {
          // Jeśli użytkownik jest adminem, załaduj dane
          await loadData();
        }
      } catch (err) {
        console.error('Error checking admin access:', err);
        setError(t('adminAccessCheckError', { defaultValue: 'Błąd podczas sprawdzania uprawnień administratora' }));
        setIsAdmin(false);
        setIsLoading(false);
      } finally {
        setAccessChecked(true);
      }
    }

    if (session && !accessChecked) {
     void checkAccess();
    } else if (!session && mounted) {
      setError(t('adminLoginRequired', { defaultValue: 'Musisz być zalogowany, aby uzyskać dostęp do panelu administratora' }));
      setIsAdmin(false);
      setAccessChecked(true);
      setIsLoading(false);
    }
  }, [session, accessChecked, mounted]);

  useEffect(() => {
    // Załaduj dane tylko jeśli użytkownik jest adminem i dostęp został sprawdzony
    if (isAdmin && accessChecked) {
     void loadData();
    }
  }, [activeTab, systemDataView, isAdmin, accessChecked]);

  useEffect(() => {
    // Zastosuj filtry i sortowanie gdy zmienią się wartości
    applyFiltersAndSort();
  }, [allLogs, actionTypeFilter, userFilter, dateFromFilter, dateToFilter, sortBy, sortOrder]);

  useEffect(() => {
    // Filtrowanie użytkowników po stronie klienta (dane już załadowane z API)
    if (activeTab === 1 && allUsers.length > 0) {
      let filtered = [...allUsers];
      
      // Filtrowanie po wyszukiwaniu
      if (userSearchFilter.trim()) {
        const searchLower = userSearchFilter.trim().toLowerCase();
        filtered = filtered.filter(user => 
          (user.email && user.email.toLowerCase().includes(searchLower)) ||
          (user.username && user.username.toLowerCase().includes(searchLower)) ||
          (user.id && user.id.toString().toLowerCase().includes(searchLower))
        );
      }
      
      // Filtrowanie po roli (admin / zwykły)
      if (userStatusFilter !== 'all') {
        filtered = filtered.filter(user =>
          userStatusFilter === 'admins' ? (user.isAdmin === true) : (user.isAdmin !== true)
        );
      }
      
      setUsers(filtered);
      setUserPage(1);
    } else if (activeTab === 1 && allUsers.length === 0) {
      // Jeśli nie ma użytkowników, ustaw pustą listę
      setUsers([]);
    }
  }, [allUsers, userSearchFilter, userStatusFilter, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 0) {
        // Załaduj wszystkie logi (bez limitu, filtrowanie po stronie klienta)
        const logsData = await getLogs({ sort: 'desc', limit: 1000 });
        setAllLogs(Array.isArray(logsData) ? logsData : []);
      } else if (activeTab === 1) {
        // Załaduj użytkowników z API
        const usersData = await getAdminUsers({ 
          search: userSearchFilter || undefined,
          // status: filtrowanie po roli robimy lokalnie (API oczekuje aktywny/nieaktywny)
          page: 1,
          limit: 1000 // Pobierz wszystkich, filtrowanie po stronie klienta
        });
        const usersList = Array.isArray(usersData?.users) ? usersData.users : [];
        setAllUsers(usersList);
        setUsers(usersList);
      } else if (activeTab === 2) {
        // Załaduj statystyki systemowe
        const statsData = await getSystemStats();
        setSystemData(statsData);
        
        // Załaduj szczegółowe dane w zależności od widoku
        if (systemDataView === 'aquariums') {
          const aquariumsData = await getAdminAquariums({ page: 1, limit: 1000 });
          const aquariumsList = Array.isArray(aquariumsData?.aquariums) ? aquariumsData.aquariums : [];
          setAllAquariums(aquariumsList);
        } else if (systemDataView === 'fish') {
          const fishData = await getAdminFish({ page: 1, limit: 1000 });
          const fishList = Array.isArray(fishData?.fish) ? fishData.fish : [];
          setAllFish(fishList);
        } else if (systemDataView === 'plants') {
          const plantsData = await getAdminPlants({ page: 1, limit: 1000 });
          const plantsList = Array.isArray(plantsData?.plants) ? plantsData.plants : [];
          setAllPlants(plantsList);
        }
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(err.message || t('adminDataLoadError', { defaultValue: 'Błąd ładowania danych' }));
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...allLogs];

    // Filtrowanie po typie akcji
    if (actionTypeFilter !== 'all') {
      filtered = filtered.filter(log => 
        (log.actionType || log.action || '').toLowerCase().includes(actionTypeFilter.toLowerCase())
      );
    }

    // Filtrowanie po użytkowniku
    if (userFilter.trim()) {
      filtered = filtered.filter(log => {
        const userId = (log.userId || log.user || '').toString().toLowerCase();
        return userId.includes(userFilter.toLowerCase());
      });
    }

    // Filtrowanie po dacie
    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.createdAt || log.timestamp);
        return logDate >= fromDate;
      });
    }
    if (dateToFilter) {
      const toDate = new Date(dateToFilter);
      toDate.setHours(23, 59, 59, 999); // Koniec dnia
      filtered = filtered.filter(log => {
        const logDate = new Date(log.createdAt || log.timestamp);
        return logDate <= toDate;
      });
    }

    // Sortowanie
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt || a.timestamp || 0);
          bValue = new Date(b.createdAt || b.timestamp || 0);
          break;
        case 'user':
          aValue = (a.userId || a.user || '').toString().toLowerCase();
          bValue = (b.userId || b.user || '').toString().toLowerCase();
          break;
        case 'action':
          aValue = (a.actionType || a.action || '').toString().toLowerCase();
          bValue = (b.actionType || b.action || '').toString().toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortBy === 'date') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });

    setLogs(filtered);
    setPage(1); // Resetuj stronę po zmianie filtrów
  };

  // Unikalne typy akcji dla filtra
  const uniqueActionTypes = useMemo(() => {
    const types = new Set();
    allLogs.forEach(log => {
      const actionType = log.actionType || log.action;
      if (actionType) types.add(actionType);
    });
    return Array.from(types).sort();
  }, [allLogs]);

  // Paginacja
  const paginatedLogs = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return logs.slice(startIndex, endIndex);
  }, [logs, page, rowsPerPage]);

  const totalPages = Math.ceil(logs.length / rowsPerPage);
  
  // Paginacja użytkowników
  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * userRowsPerPage;
    const endIndex = startIndex + userRowsPerPage;
    return users.slice(startIndex, endIndex);
  }, [users, userPage, userRowsPerPage]);
  
  const userTotalPages = Math.ceil(users.length / userRowsPerPage);
  
  // Handlery dla użytkowników
  const handleUserToggleAdmin = async (userId) => {
    try {
      const user = allUsers.find(u => u.id === userId);
      if (!user) return;
      
      const newAdminStatus = !user.isAdmin;
      const adminCognitoSub = session?.user?.id;
      
      await updateUserAdminStatus(userId, newAdminStatus, adminCognitoSub);
      
      // Aktualizuj lokalny stan
      setAllUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isAdmin: newAdminStatus } : u
      ));
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isAdmin: newAdminStatus } : u
      ));
      
      // Jeśli otwarty dialog szczegółów, zaktualizuj też tam
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => ({ ...prev, isAdmin: newAdminStatus }));
      }
    } catch (error) {
      console.error('Error toggling user admin status:', error);
      setError(error.message || t('adminToggleRightsError', { defaultValue: 'Błąd podczas zmiany uprawnień administratora' }));
    }
  };
  
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsDialog(true);
  };
  
  const handleCloseUserDetails = () => {
    setUserDetailsDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const adminCognitoSub = session?.user?.id;
        await deleteAdminUser(userToDelete.id, adminCognitoSub);
        
        // Aktualizuj lokalny stan
        setAllUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setDeleteConfirmDialog(false);
        setUserToDelete(null);
        
        // Zamknij dialog szczegółów jeśli był otwarty
        if (selectedUser && selectedUser.id === userToDelete.id) {
          setUserDetailsDialog(false);
          setSelectedUser(null);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError(error.message || t('adminDeleteUserError', { defaultValue: 'Błąd podczas usuwania użytkownika' }));
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmDialog(false);
    setUserToDelete(null);
  };

  // Handlery dla danych systemowych
  const handleSystemDataCardClick = (viewType) => {
    if (viewType === 'users') return; // Użytkownicy nie są klikalni
    setSystemDataView(viewType);
    // Załaduj dane gdy zmienia się widok
    if (activeTab === 2) {
      void loadData();
    }
  };

  const handleDeleteAquarium = (aquarium) => {
    setItemToDelete(aquarium);
    setAquariumDeleteDialog(true);
  };

  const handleDeleteFish = (fish) => {
    setItemToDelete(fish);
    setFishDeleteDialog(true);
  };

  const handleDeletePlant = (plant) => {
    setItemToDelete(plant);
    setPlantDeleteDialog(true);
  };

  const handleConfirmDeleteAquarium = async () => {
    if (itemToDelete) {
      try {
        const adminCognitoSub = session?.user?.id;
        await deleteAdminAquarium(itemToDelete.id, adminCognitoSub);
        
        // Aktualizuj lokalny stan
        setAllAquariums(prev => prev.filter(a => a.id !== itemToDelete.id));
        setAquariumDeleteDialog(false);
        setItemToDelete(null);
        
        // Odśwież statystyki
        const statsData = await getSystemStats();
        setSystemData(statsData);
      } catch (error) {
        console.error('Error deleting aquarium:', error);
        setError(error.message || t("adminDeleteAquariumError", { defaultValue: "Błąd podczas usuwania akwarium" }));
      }
    }
  };

  const handleConfirmDeleteFish = async () => {
    if (itemToDelete) {
      try {
        const adminCognitoSub = session?.user?.id;
        await deleteAdminFish(itemToDelete.id, adminCognitoSub);
        
        // Aktualizuj lokalny stan
        setAllFish(prev => prev.filter(f => f.id !== itemToDelete.id));
        setFishDeleteDialog(false);
        setItemToDelete(null);
        
        // Odśwież statystyki
        const statsData = await getSystemStats();
        setSystemData(statsData);
      } catch (error) {
        console.error('Error deleting fish:', error);
        setError(error.message || t("adminDeleteFishError", { defaultValue: "Błąd podczas usuwania ryb" }));
      }
    }
  };

  const handleConfirmDeletePlant = async () => {
    if (itemToDelete) {
      try {
        const adminCognitoSub = session?.user?.id;
        await deleteAdminPlant(itemToDelete.id, adminCognitoSub);
        
        // Aktualizuj lokalny stan
        setAllPlants(prev => prev.filter(p => p.id !== itemToDelete.id));
        setPlantDeleteDialog(false);
        setItemToDelete(null);
        
        // Odśwież statystyki
        const statsData = await getSystemStats();
        setSystemData(statsData);
      } catch (error) {
        console.error('Error deleting plant:', error);
        setError(error.message || t("adminDeletePlantError", { defaultValue: "Błąd podczas usuwania roślin" }));
      }
    }
  };

  const handleCancelSystemDelete = () => {
    setAquariumDeleteDialog(false);
    setFishDeleteDialog(false);
    setPlantDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleBackToSystemData = () => {
    setSystemDataView(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('pl-PL');
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Górny pasek z gradientem */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 96,
        background: 'linear-gradient(to bottom right, #cfeef6 0%, #87cde1 50%, #2e7fa9 100%)',
        zIndex: 5
      }} />
      
      {/* Ciemny overlay dla dark mode */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
          zIndex: 4,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />
      
      {/* Ciemny overlay na górny pasek dla dark mode */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          bgcolor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
          zIndex: 6,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Top bar */}
      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: { xs: 2, sm: 4 }, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.4)', 
              p: { xs: 0.5, sm: 0.8 }, 
              borderRadius: 1.5, 
              boxShadow: 2,
              transition: "all 0.3s", 
              backdropFilter: 'blur(8px)',
              "&:hover": { 
                boxShadow: 4, 
                transform: "translateY(-2px)", 
                bgcolor: darkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.6)' 
              },
              cursor: 'pointer', 
              minHeight: { xs: '50px', sm: '60px' }, 
              minWidth: { xs: '60px', sm: '80px' }, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mb: 0.3, color: darkMode ? 'white' : 'inherit' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: darkMode ? 'white' : "text.primary", textAlign: 'center', fontSize: { xs: '0.55rem', sm: '0.65rem' } }} suppressHydrationWarning>
                {t("return", { defaultValue: "Return" })}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 } }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        position: "relative", 
        zIndex: 2, 
        minHeight: '100vh',
        pt: { xs: 12, sm: 14 },
        pb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4 }
      }}>
        <Paper sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          bgcolor: darkMode ? 'rgba(30, 30, 30, 0.95)' : '#ffffff',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{
            p: 3,
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            bgcolor: darkMode ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.05)'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              🔐 {t("adminPanel", { defaultValue: "Panel Admina" })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("adminPanelDescription", { defaultValue: "Zarządzanie użytkownikami, logami i danymi systemowymi" })}
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 64
                }
              }}
            >
              <Tab label={t("adminLogs", { defaultValue: "Logi" })} />
              <Tab label={t("adminUsers", { defaultValue: "Użytkownicy" })} />
              <Tab label={t("adminSystemData", { defaultValue: "Dane Systemowe" })} />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{error}</Alert>
              {!isAdmin && accessChecked && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    href="/"
                    sx={{ mt: 1 }}
                  >
                    {t("return", { defaultValue: "Powrót do strony głównej" })}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {!accessChecked || isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          ) : !isAdmin ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                {t("adminNoAccess", { defaultValue: "Brak uprawnień administratora. Dostęp do panelu administratora jest ograniczony." })}
              </Alert>
              <Button 
                variant="contained" 
                component={Link} 
                href="/"
              >
                {t("return", { defaultValue: "Powrót do strony głównej" })}
              </Button>
            </Box>
          ) : (
            <>
              {/* Logi */}
              <TabPanel value={activeTab} index={0}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {t("adminLogsTitle", { defaultValue: "Logi aplikacji" })}
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({logs.length} {t("adminLogsCount", { defaultValue: "znalezionych" })})
                      </Typography>
                    </Typography>
                    <Button
                      startIcon={filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={() => setFiltersExpanded(!filtersExpanded)}
                      variant="outlined"
                      size="small"
                    >
                      <FilterListIcon sx={{ mr: 0.5 }} />
                      {t("adminFilters", { defaultValue: "Filtry" })}
                    </Button>
                  </Box>

                  {/* Filtry */}
                  <Collapse in={filtersExpanded}>
                    <Paper sx={{ p: 2, mb: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>{t("adminLogAction", { defaultValue: "Typ akcji" })}</InputLabel>
                            <Select
                                variant="outlined"
                              value={actionTypeFilter}
                              label={t("adminLogAction", { defaultValue: "Typ akcji" })}
                              onChange={(e) => setActionTypeFilter(e.target.value)}
                            >
                              <MenuItem value="all">{t("all", { defaultValue: "Wszystkie" })}</MenuItem>
                              {uniqueActionTypes.map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label={t("adminLogUser", { defaultValue: "Użytkownik (ID)" })}
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                            placeholder={t("adminLogUserPlaceholder", { defaultValue: "Szukaj po ID..." })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label={t("adminLogDateFrom", { defaultValue: "Od" })}
                            value={dateFromFilter}
                            onChange={(e) => setDateFromFilter(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label={t("adminLogDateTo", { defaultValue: "Do" })}
                            value={dateToFilter}
                            onChange={(e) => setDateToFilter(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>{t("adminSortBy", { defaultValue: "Sortuj po" })}</InputLabel>
                            <Select
                                variant="outlined"
                              value={sortBy}
                              label={t("adminSortBy", { defaultValue: "Sortuj po" })}
                              onChange={(e) => setSortBy(e.target.value)}
                            >
                              <MenuItem value="date">{t("adminLogDate", { defaultValue: "Dacie" })}</MenuItem>
                              <MenuItem value="user">{t("adminLogUser", { defaultValue: "Użytkowniku" })}</MenuItem>
                              <MenuItem value="action">{t("adminLogAction", { defaultValue: "Akcji" })}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>{t("adminSortOrder", { defaultValue: "Kolejność" })}</InputLabel>
                            <Select
                                variant="outlined"
                              value={sortOrder}
                              label={t("adminSortOrder", { defaultValue: "Kolejność" })}
                              onChange={(e) => setSortOrder(e.target.value)}
                            >
                              <MenuItem value="desc">{t("newestFirst", { defaultValue: "Najnowsze" })}</MenuItem>
                              <MenuItem value="asc">{t("oldestFirst", { defaultValue: "Najstarsze" })}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setActionTypeFilter('all');
                              setUserFilter('');
                              setDateFromFilter('');
                              setDateToFilter('');
                            }}
                          >
                            {t("adminClearFilters", { defaultValue: "Wyczyść filtry" })}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Collapse>
                </Box>

                {logs.length === 0 ? (
                  <Alert severity="info">
                    {t("noLogs", { defaultValue: "Brak logów do wyświetlenia" })}
                  </Alert>
                ) : (
                  <>
                    <TableContainer sx={{ maxHeight: '70vh' }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>{t("adminLogDate", { defaultValue: "Data" })}</strong></TableCell>
                            <TableCell><strong>{t("adminLogUser", { defaultValue: "Użytkownik" })}</strong></TableCell>
                            <TableCell><strong>{t("adminLogAction", { defaultValue: "Akcja" })}</strong></TableCell>
                            <TableCell><strong>{t("adminLogAquarium", { defaultValue: "Akwarium" })}</strong></TableCell>
                            <TableCell><strong>{t("adminLogDetails", { defaultValue: "Szczegóły" })}</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedLogs.map((log, index) => (
                            <TableRow key={log.id || index} hover>
                              <TableCell>{formatDate(log.createdAt || log.timestamp)}</TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                  {log.userId || log.user || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={log.actionType || log.action || '-'} 
                                  size="small"
                                  color={
                                    (log.actionType || log.action || '').includes('ERROR') || 
                                    (log.actionType || log.action || '').includes('DELETE') 
                                      ? 'error' 
                                      : (log.actionType || log.action || '').includes('CREATE') || 
                                        (log.actionType || log.action || '').includes('ADD')
                                      ? 'success'
                                      : 'default'
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {log.aquariumId ? (
                                  <Link href={`/my-aquariums/${log.aquariumId}`} style={{ textDecoration: 'none' }}>
                                    <Chip 
                                      label={log.aquariumName || log.aquariumId} 
                                      size="small"
                                      variant="outlined"
                                      clickable
                                    />
                                  </Link>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {log.message || log.title || '-'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Paginacja */}
                    {totalPages > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("adminLogsShowing", { 
                            defaultValue: "Wyświetlanie {{from}}-{{to}} z {{total}}",
                            from: (page - 1) * rowsPerPage + 1,
                            to: Math.min(page * rowsPerPage, logs.length),
                            total: logs.length
                          })}
                        </Typography>
                        <Stack spacing={2} direction="row" alignItems="center">
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                                variant="outlined"
                              value={rowsPerPage}
                              onChange={(e) => {
                                setRowsPerPage(e.target.value);
                                setPage(1);
                              }}
                            >
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                              <MenuItem value={100}>100</MenuItem>
                            </Select>
                          </FormControl>
                          <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                            showFirstButton
                            showLastButton
                          />
                        </Stack>
                      </Box>
                    )}
                  </>
                )}
              </TabPanel>

              {/* Użytkownicy */}
              <TabPanel value={activeTab} index={1}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {t("adminUsersTitle", { defaultValue: "Zarządzanie użytkownikami" })}
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({users.length} {t("adminUsersCount", { defaultValue: "znalezionych" })})
                      </Typography>
                    </Typography>
                  </Box>

                  {/* Filtry użytkowników */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t("adminUserSearch", { defaultValue: "Szukaj użytkownika" })}
                        value={userSearchFilter}
                        onChange={(e) => setUserSearchFilter(e.target.value)}
                        placeholder={t("adminUserSearchPlaceholder", { defaultValue: "Email, username, ID..." })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>
                          <Tooltip title={t("adminUserRoleFilterTooltip", { defaultValue: "Filtruj użytkowników według roli: Administratorzy - mają dostęp do panelu admina, Zwykli - standardowi użytkownicy" })}>
                            <span>{t("adminUserRole", { defaultValue: "Rola" })}</span>
                          </Tooltip>
                        </InputLabel>
                        <Select
                            variant="outlined"
                          value={userStatusFilter}
                          label={t("adminUserRole", { defaultValue: "Rola" })}
                          onChange={(e) => setUserStatusFilter(e.target.value)}
                        >
                          <MenuItem value="all">{t("adminUserAll", { defaultValue: "Wszyscy" })}</MenuItem>
                          <MenuItem value="admins">{t("adminUserAdmins", { defaultValue: "Administratorzy" })}</MenuItem>
                          <MenuItem value="regular">{t("adminUserRegular", { defaultValue: "Zwykli użytkownicy" })}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {users.length === 0 ? (
                  <Alert severity="info">
                    {t("adminNoUsers", { defaultValue: "Brak użytkowników do wyświetlenia" })}
                  </Alert>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>{t("adminUserEmail", { defaultValue: "Email" })}</strong></TableCell>
                            <TableCell><strong>{t("adminUserUsername", { defaultValue: "Nazwa użytkownika" })}</strong></TableCell>
                            <TableCell><strong>{t("adminUserCreated", { defaultValue: "Data rejestracji" })}</strong></TableCell>
                            <TableCell><strong>{t("adminUserAdminRights", { defaultValue: "Uprawnienia administratora" })}</strong></TableCell>
                            <TableCell><strong>{t("adminUserActions", { defaultValue: "Zarządzanie" })}</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedUsers.map((user) => (
                            <TableRow key={user.id} hover>
                              <TableCell>
                                <Typography variant="body2">{user.email || '-'}</Typography>
                              </TableCell>
                              <TableCell>{user.username || '-'}</TableCell>
                              <TableCell>{formatDate(user.createdAt)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={user.isAdmin ? t("adminUserIsAdminYes", { defaultValue: "Tak" }) : t("adminUserIsAdminNo", { defaultValue: "Nie" })} 
                                  size="small"
                                  color={user.isAdmin ? 'secondary' : 'default'}
                                />
                                <Tooltip title={user.isAdmin ? t("adminUserGrantAdminRights", { defaultValue: "Użytkownik ma uprawnienia administratora" }) : t("adminUserRemoveAdminRights", { defaultValue: "Użytkownik nie ma uprawnień administratora" })}>
                                  <IconButton size="small" sx={{ ml: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>ℹ️</Typography>
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Tooltip title={user.isAdmin ? t("adminUserRemoveAdminRights", { defaultValue: "Odbierz uprawnienia administratora" }) : t("adminUserGrantAdminRights", { defaultValue: "Nadaj uprawnienia administratora" })}>
                                    <Switch
                                      checked={user.isAdmin || false}
                                      onChange={() => void handleUserToggleAdmin(user.id)}
                                      size="small"
                                      color="secondary"
                                    />
                                  </Tooltip>
                                  <Tooltip title={t("adminUserDelete", { defaultValue: "Usuń użytkownika" })}>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteUser(user)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Paginacja użytkowników */}
                    {userTotalPages > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("adminUsersShowing", { 
                            defaultValue: "Wyświetlanie {{from}}-{{to}} z {{total}}",
                            from: (userPage - 1) * userRowsPerPage + 1,
                            to: Math.min(userPage * userRowsPerPage, users.length),
                            total: users.length
                          })}
                        </Typography>
                        <Stack spacing={2} direction="row" alignItems="center">
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                                variant="outlined"
                              value={userRowsPerPage}
                              onChange={(e) => {
                                setUserRowsPerPage(e.target.value);
                                setUserPage(1);
                              }}
                            >
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                            </Select>
                          </FormControl>
                          <Pagination
                            count={userTotalPages}
                            page={userPage}
                            onChange={(e, value) => setUserPage(value)}
                            color="primary"
                            showFirstButton
                            showLastButton
                          />
                        </Stack>
                      </Box>
                    )}
                  </>
                )}

                {/* Dialog szczegółów użytkownika */}
                <Dialog 
                  open={userDetailsDialog} 
                  onClose={handleCloseUserDetails}
                  maxWidth="md"
                  fullWidth
                  disableScrollLock
                >
                  <DialogTitle>
                    {t("adminUserDetailsTitle", { defaultValue: "Szczegóły użytkownika" })}
                  </DialogTitle>
                  <DialogContent>
                    {selectedUser && (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminUserEmail", { defaultValue: "Email" })}
                          </Typography>
                          <Typography variant="body1">{selectedUser.email}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminUserUsername", { defaultValue: "Nazwa użytkownika" })}
                          </Typography>
                          <Typography variant="body1">{selectedUser.username || '-'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminUserID", { defaultValue: "ID użytkownika" })}
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {selectedUser.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminUserCreated", { defaultValue: "Data rejestracji" })}
                          </Typography>
                          <Typography variant="body1">{formatDate(selectedUser.createdAt)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: '150px' }}>
                              {t("adminUserAdminRights", { defaultValue: "Uprawnienia administratora" })}
                            </Typography>
                            <Chip 
                              label={selectedUser.isAdmin ? t("adminUserIsAdminYes", { defaultValue: "Tak" }) : t("adminUserIsAdminNo", { defaultValue: "Nie" })} 
                              color={selectedUser.isAdmin ? 'secondary' : 'default'}
                              size="small"
                            />
                            <Tooltip title={selectedUser.isAdmin ? t("adminUserRemoveAdminRights", { defaultValue: "Odbierz uprawnienia administratora" }) : t("adminUserGrantAdminRights", { defaultValue: "Nadaj uprawnienia administratora" })}>
                              <Switch
                                checked={selectedUser.isAdmin || false}
                                onChange={() => {
                                 void handleUserToggleAdmin(selectedUser.id);
                                  setSelectedUser(prev => ({ ...prev, isAdmin: !prev.isAdmin }));
                                }}
                                size="small"
                                color="secondary"
                              />
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button 
                      onClick={() => {
                        handleCloseUserDetails();
                        handleDeleteUser(selectedUser);
                      }}
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="outlined"
                    >
                      {t("adminUserDelete", { defaultValue: "Usuń" })}
                    </Button>
                    <Button onClick={handleCloseUserDetails} variant="contained">
                      {t("close", { defaultValue: "Zamknij" })}
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Dialog potwierdzenia usunięcia */}
                <Dialog 
                  open={deleteConfirmDialog} 
                  onClose={handleCancelDelete}
                  disableScrollLock
                >
                  <DialogTitle>
                    {t("adminUserDeleteConfirmTitle", { defaultValue: "Potwierdź usunięcie użytkownika" })}
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      {t("adminUserDeleteConfirmMessage", { 
                        defaultValue: "Czy na pewno chcesz usunąć użytkownika {{email}}? Ta operacja jest nieodwracalna.",
                        email: userToDelete?.email || ''
                      })}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancelDelete}>
                      {t("cancel", { defaultValue: "Anuluj" })}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                      {t("adminUserDeleteConfirm", { defaultValue: "Usuń" })}
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Dialogi potwierdzenia usunięcia dla danych systemowych */}
                <Dialog open={aquariumDeleteDialog} onClose={handleCancelSystemDelete} disableScrollLock>
                  <DialogTitle>
                    {t("adminDeleteAquariumConfirmTitle", { defaultValue: "Potwierdź usunięcie akwarium" })}
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      {t("adminDeleteAquariumConfirmMessage", { 
                        defaultValue: "Czy na pewno chcesz usunąć akwarium \"{{name}}\"? Ta operacja jest nieodwracalna i usunie wszystkie powiązane ryby i rośliny.",
                        name: itemToDelete?.name || ''
                      })}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancelSystemDelete}>
                      {t("cancel", { defaultValue: "Anuluj" })}
                    </Button>
                    <Button onClick={handleConfirmDeleteAquarium} color="error" variant="contained">
                      {t("adminUserDeleteConfirm", { defaultValue: "Usuń" })}
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog open={fishDeleteDialog} onClose={handleCancelSystemDelete}>
                  <DialogTitle>
                    {t("adminDeleteFishConfirmTitle", { defaultValue: "Potwierdź usunięcie ryb" })}
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      {t("adminDeleteFishConfirmMessage", { 
                        defaultValue: "Czy na pewno chcesz usunąć {{count}} {{species}} z akwarium \"{{aquarium}}\"?",
                        count: itemToDelete?.count || 0,
                        species: itemToDelete?.speciesName || '',
                        aquarium: itemToDelete?.aquariumName || ''
                      })}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancelSystemDelete}>
                      {t("cancel", { defaultValue: "Anuluj" })}
                    </Button>
                    <Button onClick={handleConfirmDeleteFish} color="error" variant="contained">
                      {t("adminUserDeleteConfirm", { defaultValue: "Usuń" })}
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog open={plantDeleteDialog} onClose={handleCancelSystemDelete} disableScrollLock>
                  <DialogTitle>
                    {t("adminDeletePlantConfirmTitle", { defaultValue: "Potwierdź usunięcie roślin" })}
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      {t("adminDeletePlantConfirmMessage", { 
                        defaultValue: "Czy na pewno chcesz usunąć {{count}} {{plant}} z akwarium \"{{aquarium}}\"?",
                        count: itemToDelete?.count || 0,
                        plant: itemToDelete?.plantName || '',
                        aquarium: itemToDelete?.aquariumName || ''
                      })}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancelSystemDelete}>
                      {t("cancel", { defaultValue: "Anuluj" })}
                    </Button>
                    <Button onClick={handleConfirmDeletePlant} color="error" variant="contained">
                      {t("adminUserDeleteConfirm", { defaultValue: "Usuń" })}
                    </Button>
                  </DialogActions>
                </Dialog>
              </TabPanel>

              {/* Dane Systemowe */}
              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {t("adminSystemDataTitle", { defaultValue: "Dane systemowe" })}
                </Typography>

                {systemDataView === null ? (
                  systemData ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-evenly', 
                      flexWrap: 'wrap',
                      gap: 3,
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                      {/* Statystyki użytkowników - nieklikalne */}
                      <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '0 1 auto' }, minWidth: { xs: '100%', sm: '200px', md: '220px' } }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            👥 {t("adminSystemUsers", { defaultValue: "Użytkownicy" })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminSystemTotalUsers", { defaultValue: "Wszystkich użytkowników" })}
                          </Typography>
                          <Typography variant="h4">{systemData?.totalUsers || 0}</Typography>
                        </CardContent>
                      </Card>

                      {/* Statystyki akwariów - klikalne */}
                      <Card 
                        sx={{ 
                          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '0 1 auto' }, 
                          minWidth: { xs: '100%', sm: '200px', md: '220px' },
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', transition: 'all 0.2s' }
                        }}
                        onClick={() => handleSystemDataCardClick('aquariums')}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            🐠 {t("adminSystemAquariums", { defaultValue: "Akwaria" })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminSystemTotalAquariums", { defaultValue: "Wszystkich akwariów" })}
                          </Typography>
                          <Typography variant="h4">{systemData?.totalAquariums || 0}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {t("adminSystemClickToManage", { defaultValue: "Kliknij, aby zarządzać" })}
                          </Typography>
                        </CardContent>
                      </Card>

                      {/* Statystyki ryb - klikalne */}
                      <Card 
                        sx={{ 
                          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '0 1 auto' }, 
                          minWidth: { xs: '100%', sm: '200px', md: '220px' },
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', transition: 'all 0.2s' }
                        }}
                        onClick={() => handleSystemDataCardClick('fish')}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            🐟 {t("adminSystemFish", { defaultValue: "Ryby" })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminSystemTotalFish", { defaultValue: "Wszystkich ryb" })}
                          </Typography>
                          <Typography variant="h4">{(systemData?.totalFish || 0).toLocaleString()}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {t("adminSystemClickToManage", { defaultValue: "Kliknij, aby zarządzać" })}
                          </Typography>
                        </CardContent>
                      </Card>

                      {/* Statystyki roślin - klikalne */}
                      <Card 
                        sx={{ 
                          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '0 1 auto' }, 
                          minWidth: { xs: '100%', sm: '200px', md: '220px' },
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', transition: 'all 0.2s' }
                        }}
                        onClick={() => handleSystemDataCardClick('plants')}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            🌿 {t("adminSystemPlants", { defaultValue: "Rośliny" })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {t("adminSystemTotalPlants", { defaultValue: "Wszystkich roślin" })}
                          </Typography>
                          <Typography variant="h4">{(systemData?.totalPlants || 0).toLocaleString()}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {t("adminSystemClickToManage", { defaultValue: "Kliknij, aby zarządzać" })}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ) : (
                    <Alert severity="info">
                      {t("adminSystemDataLoading", { defaultValue: "Ładowanie danych systemowych..." })}
                    </Alert>
                  )
                ) : systemDataView === 'aquariums' ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                      <IconButton onClick={handleBackToSystemData} sx={{ mr: 1 }}>
                        <KeyboardReturnOutlinedIcon />
                      </IconButton>
                      <Typography variant="h6">
                        {t("adminManageAquariums", { defaultValue: "Zarządzanie akwariami" })}
                      </Typography>
                    </Box>
                    {allAquariums.length === 0 ? (
                      <Alert severity="info">
                        {t("adminNoAquariums", { defaultValue: "Brak akwariów do wyświetlenia" })}
                      </Alert>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>{t("adminAquariumName", { defaultValue: "Nazwa" })}</strong></TableCell>
                              <TableCell><strong>{t("adminAquariumOwner", { defaultValue: "Właściciel" })}</strong></TableCell>
                              <TableCell><strong>{t("adminAquariumWaterType", { defaultValue: "Typ wody" })}</strong></TableCell>
                              <TableCell><strong>{t("adminAquariumVolume", { defaultValue: "Objętość (L)" })}</strong></TableCell>
                              <TableCell><strong>{t("adminAquariumCreated", { defaultValue: "Data utworzenia" })}</strong></TableCell>
                              <TableCell><strong>{t("adminUserActions", { defaultValue: "Akcje" })}</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allAquariums.map((aquarium) => (
                              <TableRow key={aquarium.id} hover>
                                <TableCell>{aquarium.name}</TableCell>
                                <TableCell>{aquarium.owner}</TableCell>
                                <TableCell>{aquarium.waterType}</TableCell>
                                <TableCell>{aquarium.volumeLiters}</TableCell>
                                <TableCell>{formatDate(aquarium.createdAt)}</TableCell>
                                <TableCell>
                                  <Tooltip title={t("adminUserDelete", { defaultValue: "Usuń akwarium" })}>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteAquarium(aquarium)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                ) : systemDataView === 'fish' ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                      <IconButton onClick={handleBackToSystemData} sx={{ mr: 1 }}>
                        <KeyboardReturnOutlinedIcon />
                      </IconButton>
                      <Typography variant="h6">
                        {t("adminManageFish", { defaultValue: "Zarządzanie rybami" })}
                      </Typography>
                    </Box>
                    {allFish.length === 0 ? (
                      <Alert severity="info">
                        {t("adminNoFish", { defaultValue: "Brak ryb do wyświetlenia" })}
                      </Alert>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>{t("adminFishSpecies", { defaultValue: "Gatunek" })}</strong></TableCell>
                              <TableCell><strong>{t("adminFishAquarium", { defaultValue: "Akwarium" })}</strong></TableCell>
                              <TableCell><strong>{t("adminFishOwner", { defaultValue: "Właściciel" })}</strong></TableCell>
                              <TableCell><strong>{t("adminFishCount", { defaultValue: "Liczba" })}</strong></TableCell>
                              <TableCell><strong>{t("adminAquariumCreated", { defaultValue: "Data dodania" })}</strong></TableCell>
                              <TableCell><strong>{t("adminUserActions", { defaultValue: "Akcje" })}</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allFish.map((fish) => (
                              <TableRow key={fish.id} hover>
                                <TableCell>{fish.speciesName}</TableCell>
                                <TableCell>{fish.aquariumName}</TableCell>
                                <TableCell>{fish.owner}</TableCell>
                                <TableCell>{fish.count}</TableCell>
                                <TableCell>{formatDate(fish.createdAt)}</TableCell>
                                <TableCell>
                                  <Tooltip title={t("adminDeleteFish", { defaultValue: "Usuń ryby z akwarium" })}>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteFish(fish)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                ) : systemDataView === 'plants' ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                      <IconButton onClick={handleBackToSystemData} sx={{ mr: 1 }}>
                        <KeyboardReturnOutlinedIcon />
                      </IconButton>
                      <Typography variant="h6">
                        {t("adminManagePlants", { defaultValue: "Zarządzanie roślinami" })}
                      </Typography>
                    </Box>
                    {allPlants.length === 0 ? (
                      <Alert severity="info">
                        {t("adminNoPlants", { defaultValue: "Brak roślin do wyświetlenia" })}
                      </Alert>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>{t("adminPlantName", { defaultValue: "Nazwa rośliny" })}</strong></TableCell>
                              <TableCell><strong>{t("adminFishAquarium", { defaultValue: "Akwarium" })}</strong></TableCell>
                              <TableCell><strong>{t("adminFishOwner", { defaultValue: "Właściciel" })}</strong></TableCell>
                              <TableCell><strong>{t("adminFishCount", { defaultValue: "Liczba" })}</strong></TableCell>
                              <TableCell><strong>{t("adminAquariumCreated", { defaultValue: "Data dodania" })}</strong></TableCell>
                              <TableCell><strong>{t("adminUserActions", { defaultValue: "Akcje" })}</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allPlants.map((plant) => (
                              <TableRow key={plant.id} hover>
                                <TableCell>{plant.plantName}</TableCell>
                                <TableCell>{plant.aquariumName}</TableCell>
                                <TableCell>{plant.owner}</TableCell>
                                <TableCell>{plant.count}</TableCell>
                                <TableCell>{formatDate(plant.createdAt)}</TableCell>
                                <TableCell>
                                  <Tooltip title={t("adminDeletePlant", { defaultValue: "Usuń rośliny z akwarium" })}>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeletePlant(plant)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                ) : (
                  <Alert severity="info">
                    {t("adminSystemDataLoading", { defaultValue: "Ładowanie danych systemowych..." })}
                  </Alert>
                )}
              </TabPanel>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
