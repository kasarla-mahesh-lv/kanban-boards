import { apiGet, apiPost } from './ApiCommon';

export interface HistoryItem {
  _id: string;
  taskId: string;
  activity: string;
  createdBy?: string;  // Keep this for your component
  createdAt: string;
  timestamp?: string;  // Keep this for your component
}

export interface CreateHistoryPayload {
  taskId: string;
  activity: string;
  createdBy?: string;
}

/**
 * GET ALL HISTORY - Fetch complete history
 * Backend: GET /api/history
 */
export const getAllHistoryApi = async (): Promise<HistoryItem[]> => {
  try {
    console.log("📜 Fetching all history");
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    // Use 'any' type for the response since backend returns different structure
    const response = await apiGet<any[]>("/history", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ History fetched successfully:", response);
    
    // Transform backend data to match your frontend interface
    const transformedResponse: HistoryItem[] = response.map(item => ({
      _id: item._id,
      taskId: item.taskId,
      activity: item.activity,
      // Backend has both createdBy and personId, prefer createdBy if available
      createdBy: item.createdBy || item.personId || "Unknown",
      createdAt: item.createdAt,
      timestamp: item.createdAt  // Use createdAt as timestamp
    }));
    
    return transformedResponse;
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    throw error;
  }
};

/**
 * GET TASK HISTORY - Fetch history for a specific task
 * Backend: GET /api/history/:taskId
 */
export const getTaskHistoryApi = async (taskId: string): Promise<HistoryItem[]> => {
  try {
    console.log("📜 Fetching history for task:", taskId);
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await apiGet<any[]>(`/history/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Task history fetched for ${taskId}:`, response);
    
    const transformedResponse: HistoryItem[] = response.map(item => ({
      _id: item._id,
      taskId: item.taskId,
      activity: item.activity,
      createdBy: item.createdBy || item.personId || "Unknown",
      createdAt: item.createdAt,
      timestamp: item.createdAt
    }));
    
    return transformedResponse;
  } catch (error) {
    console.error("❌ Error fetching task history:", error);
    throw error;
  }
};

/**
 * CREATE HISTORY - Create a new history record
 * Backend: POST /api/history
 */
export const createHistoryApi = async (payload: CreateHistoryPayload): Promise<HistoryItem> => {
  try {
    console.log("📝 Creating history record:", payload);
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    // Backend expects only taskId and activity
    // createdBy and personId are set by the backend controller
    const backendPayload = {
      taskId: payload.taskId,
      activity: payload.activity
    };
    
    const response = await apiPost<any, typeof backendPayload>("/history", backendPayload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ History created successfully:", response);
    
    const transformedResponse: HistoryItem = {
      _id: response._id,
      taskId: response.taskId,
      activity: response.activity,
      createdBy: response.createdBy || response.personId || "Unknown",
      createdAt: response.createdAt,
      timestamp: response.createdAt
    };
    
    return transformedResponse;
  } catch (error) {
    console.error("❌ Error creating history:", error);
    throw error;
  }
};