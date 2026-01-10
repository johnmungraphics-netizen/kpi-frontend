import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface PeriodSetting {
  id: number;
  period_type: string;
  quarter: string | null;
  year: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface ReminderSetting {
  id: number;
  reminder_type: string;
  days_before: number;
  is_active: boolean;
}

interface DailyReminderSetting {
  is_enabled: boolean;
  time: string;
  cc_emails: string[];
}

interface RatingOption {
  id: number;
  rating_type: string;
  rating_value: number;
  label: string;
  description?: string;
}

interface SettingsState {
  periodSettings: PeriodSetting[];
  reminderSettings: ReminderSetting[];
  dailyReminderSetting: DailyReminderSetting;
  ratingOptions: RatingOption[];
  hrEmailNotifications: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SettingsState = {
  periodSettings: [],
  reminderSettings: [],
  dailyReminderSetting: {
    is_enabled: false,
    time: '09:00',
    cc_emails: [],
  },
  ratingOptions: [],
  hrEmailNotifications: true,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPeriodSettings = createAsyncThunk(
  'settings/fetchPeriodSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings/period-settings');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch period settings');
    }
  }
);

export const createPeriodSetting = createAsyncThunk(
  'settings/createPeriodSetting',
  async (data: Partial<PeriodSetting>, { rejectWithValue }) => {
    try {
      const response = await api.post('/settings/period-settings', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create period setting');
    }
  }
);

export const updatePeriodSetting = createAsyncThunk(
  'settings/updatePeriodSetting',
  async ({ id, data }: { id: number; data: Partial<PeriodSetting> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/settings/period-settings/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update period setting');
    }
  }
);

export const deletePeriodSetting = createAsyncThunk(
  'settings/deletePeriodSetting',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/settings/period-settings/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete period setting');
    }
  }
);

export const fetchReminderSettings = createAsyncThunk(
  'settings/fetchReminderSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings/reminder-settings');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reminder settings');
    }
  }
);

export const updateReminderSetting = createAsyncThunk(
  'settings/updateReminderSetting',
  async ({ id, data }: { id: number; data: Partial<ReminderSetting> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/settings/reminder-settings/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update reminder setting');
    }
  }
);

export const fetchDailyReminderSetting = createAsyncThunk(
  'settings/fetchDailyReminderSetting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings/daily-reminders');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch daily reminder setting');
    }
  }
);

export const updateDailyReminderSetting = createAsyncThunk(
  'settings/updateDailyReminderSetting',
  async (data: DailyReminderSetting, { rejectWithValue }) => {
    try {
      const response = await api.post('/settings/daily-reminders', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update daily reminder setting');
    }
  }
);

export const fetchRatingOptions = createAsyncThunk(
  'settings/fetchRatingOptions',
  async (ratingType: string | undefined, { rejectWithValue }) => {
    try {
      const url = ratingType ? `/rating-options?type=${ratingType}` : '/rating-options';
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rating options');
    }
  }
);

export const updateRatingOption = createAsyncThunk(
  'settings/updateRatingOption',
  async ({ id, data }: { id: number; data: Partial<RatingOption> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/rating-options/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rating option');
    }
  }
);

export const fetchHREmailNotifications = createAsyncThunk(
  'settings/fetchHREmailNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings/hr-email-notifications');
      return response.data.enabled;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch HR email notifications');
    }
  }
);

export const updateHREmailNotifications = createAsyncThunk(
  'settings/updateHREmailNotifications',
  async (enabled: boolean, { rejectWithValue }) => {
    try {
      const response = await api.post('/settings/hr-email-notifications', { enabled });
      return response.data.enabled;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update HR email notifications');
    }
  }
);

// Slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Period Settings
    builder
      .addCase(fetchPeriodSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeriodSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.periodSettings = Array.isArray(action.payload) ? action.payload : action.payload.periodSettings || [];
      })
      .addCase(fetchPeriodSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createPeriodSetting.fulfilled, (state, action) => {
        state.periodSettings.push(action.payload);
      })
      .addCase(updatePeriodSetting.fulfilled, (state, action) => {
        const index = state.periodSettings.findIndex((ps) => ps.id === action.payload.id);
        if (index !== -1) {
          state.periodSettings[index] = action.payload;
        }
      })
      .addCase(deletePeriodSetting.fulfilled, (state, action) => {
        state.periodSettings = state.periodSettings.filter((ps) => ps.id !== action.payload);
      });

    // Reminder Settings
    builder
      .addCase(fetchReminderSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReminderSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.reminderSettings = Array.isArray(action.payload) ? action.payload : action.payload.reminderSettings || [];
      })
      .addCase(fetchReminderSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(updateReminderSetting.fulfilled, (state, action) => {
      const index = state.reminderSettings.findIndex((rs) => rs.id === action.payload.id);
      if (index !== -1) {
        state.reminderSettings[index] = action.payload;
      }
    });

    // Daily Reminder Setting
    builder
      .addCase(fetchDailyReminderSetting.fulfilled, (state, action) => {
        state.dailyReminderSetting = action.payload;
      })
      .addCase(updateDailyReminderSetting.fulfilled, (state, action) => {
        state.dailyReminderSetting = action.payload;
      });

    // Rating Options
    builder
      .addCase(fetchRatingOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatingOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.ratingOptions = Array.isArray(action.payload) ? action.payload : action.payload.ratingOptions || [];
      })
      .addCase(fetchRatingOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(updateRatingOption.fulfilled, (state, action) => {
      const index = state.ratingOptions.findIndex((ro) => ro.id === action.payload.id);
      if (index !== -1) {
        state.ratingOptions[index] = action.payload;
      }
    });

    // HR Email Notifications
    builder
      .addCase(fetchHREmailNotifications.fulfilled, (state, action) => {
        state.hrEmailNotifications = action.payload;
      })
      .addCase(updateHREmailNotifications.fulfilled, (state, action) => {
        state.hrEmailNotifications = action.payload;
      });
  },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
