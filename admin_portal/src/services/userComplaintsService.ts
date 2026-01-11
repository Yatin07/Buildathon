import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  limit,
  QueryConstraint,
  Unsubscribe
} from 'firebase/firestore';
import { userDb } from '../config/firebase';
import { extractCityFromAddress, parseAddress } from '../utils/addressParser';

export interface UserComplaint {
  complaintId: string;
  category: string;
  city: string;
  pincode: string;
  description: string;
  createdAt: any; // Firestore Timestamp
  userId: string;
  userName: string;
  userPhone: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  // Additional fields that might be useful
  status?: string;
  priority?: string;
  department?: string;
  address?: string;
  ward?: string;
  updatedAt?: any;
}

export interface ComplaintFilters {
  category?: string;
  city?: string;
  status?: string;
  priority?: string;
  department?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FetchOptions {
  limitCount?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: ComplaintFilters;
}

/**
 * Fetches user complaints from the userApp Firestore instance
 * @param options - Configuration options for fetching complaints
 * @returns Promise<UserComplaint[]> - Array of user complaints
 */
export const fetchUserComplaints = async (options: FetchOptions = {}): Promise<UserComplaint[]> => {
  try {
    const {
      limitCount = 50,
      orderByField = 'createdAt',
      orderDirection = 'desc',
      filters = {}
    } = options;

    const complaintsRef = collection(userDb, 'complaints');
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.city) {
      constraints.push(where('city', '==', filters.city));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }
    if (filters.department) {
      constraints.push(where('department', '==', filters.department));
    }
    if (filters.dateFrom) {
      constraints.push(where('createdAt', '>=', filters.dateFrom));
    }
    if (filters.dateTo) {
      constraints.push(where('createdAt', '<=', filters.dateTo));
    }

    // Apply ordering and limit
    constraints.push(orderBy(orderByField, orderDirection));
    constraints.push(limit(limitCount));

    const q = query(complaintsRef, ...constraints);

    // For one-time fetch, we'll use getDocs instead of onSnapshot
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(q);

    const complaints: UserComplaint[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Extract the required fields with proper mapping
      // Handle both nested (new mobile app) and flat (legacy) structures
      const complaint: UserComplaint = {
        complaintId: data.complaintId || doc.id,
        category: data.category || 'Unknown',
        // Handle nested location.city or flat city field
        city: data.location?.city || data.city || extractCityFromAddress(data.location?.address || data.address) || data.ward || 'Unknown',
        // Handle nested location.pincode or flat pincode field
        pincode: data.location?.pincode || data.pincode || parseAddress(data.location?.address || data.address).pincode || 'Unknown',
        description: data.description || 'No description provided',
        createdAt: data.createdAt || data.timeline?.created,
        // Handle nested user.id or flat userId field
        userId: data.user?.id || data.userId || 'Unknown',
        // Handle nested user.name or flat userName field
        userName: data.user?.name || data.userName || 'Anonymous',
        // Handle nested user.phone or flat userPhone field
        userPhone: data.user?.phone || data.userPhone || 'Not provided',
        // Handle nested location.coordinates or flat lat/lng fields
        latitude: data.location?.coordinates?.lat || data.latitude || 0,
        longitude: data.location?.coordinates?.lng || data.longitude || 0,
        imageUrl: data.imageUrl || data.images?.[0] || '',
        // Additional fields
        status: data.status || 'Open',
        priority: data.priority || 'Medium',
        department: data.department || 'Not assigned',
        // Handle nested location.address or flat address field
        address: data.location?.address || data.address || 'Address not provided',
        ward: data.ward || data.city || 'Unknown',
        updatedAt: data.updatedAt || data.timeline?.lastUpdated
      };

      complaints.push(complaint);
    });

    console.log(`✅ Fetched ${complaints.length} user complaints`);
    return complaints;

  } catch (error) {
    console.error('❌ Error fetching user complaints:', error);
    throw new Error(`Failed to fetch user complaints: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Sets up a real-time listener for user complaints
 * @param callback - Function to call when complaints data changes
 * @param options - Configuration options for the listener
 * @returns Unsubscribe function to stop listening
 */
export const listenToUserComplaints = (
  callback: (complaints: UserComplaint[]) => void,
  options: FetchOptions = {}
): Unsubscribe => {
  try {
    const {
      limitCount = 50,
      orderByField = 'createdAt',
      orderDirection = 'desc',
      filters = {}
    } = options;

    const complaintsRef = collection(userDb, 'complaints');
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.city) {
      constraints.push(where('city', '==', filters.city));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }
    if (filters.department) {
      constraints.push(where('department', '==', filters.department));
    }
    if (filters.dateFrom) {
      constraints.push(where('createdAt', '>=', filters.dateFrom));
    }
    if (filters.dateTo) {
      constraints.push(where('createdAt', '<=', filters.dateTo));
    }

    // Apply ordering and limit
    constraints.push(orderBy(orderByField, orderDirection));
    constraints.push(limit(limitCount));

    const q = query(complaintsRef, ...constraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaints: UserComplaint[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Handle both nested (new mobile app) and flat (legacy) structures
        const complaint: UserComplaint = {
          complaintId: data.complaintId || doc.id,
          category: data.category || 'Unknown',
          // Handle nested location.city or flat city field
          city: data.location?.city || data.city || extractCityFromAddress(data.location?.address || data.address) || data.ward || 'Unknown',
          // Handle nested location.pincode or flat pincode field
          pincode: data.location?.pincode || data.pincode || parseAddress(data.location?.address || data.address).pincode || 'Unknown',
          description: data.description || 'No description provided',
          createdAt: data.createdAt || data.timeline?.created,
          // Handle nested user.id or flat userId field
          userId: data.user?.id || data.userId || 'Unknown',
          // Handle nested user.name or flat userName field
          userName: data.user?.name || data.userName || 'Anonymous',
          // Handle nested user.phone or flat userPhone field
          userPhone: data.user?.phone || data.userPhone || 'Not provided',
          // Handle nested location.coordinates or flat lat/lng fields
          latitude: data.location?.coordinates?.lat || data.latitude || 0,
          longitude: data.location?.coordinates?.lng || data.longitude || 0,
          imageUrl: data.imageUrl || data.images?.[0] || '',
          // Additional fields
          status: data.status || 'Open',
          priority: data.priority || 'Medium',
          department: data.department || 'Not assigned',
          // Handle nested location.address or flat address field
          address: data.location?.address || data.address || 'Address not provided',
          ward: data.ward || data.city || 'Unknown',
          updatedAt: data.updatedAt || data.timeline?.lastUpdated
        };

        complaints.push(complaint);
      });

      console.log(`📡 Real-time update: ${complaints.length} user complaints`);
      callback(complaints);
    }, (error) => {
      console.error('❌ Error in real-time listener:', error);
      callback([]);
    });

    return unsubscribe;

  } catch (error) {
    console.error('❌ Error setting up real-time listener:', error);
    throw new Error(`Failed to set up real-time listener: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Fetches a single complaint by ID
 * @param complaintId - The ID of the complaint to fetch
 * @returns Promise<UserComplaint | null> - The complaint or null if not found
 */
export const fetchUserComplaintById = async (complaintId: string): Promise<UserComplaint | null> => {
  try {
    const { getDoc, doc } = await import('firebase/firestore');
    const complaintRef = doc(userDb, 'complaints', complaintId);
    const snapshot = await getDoc(complaintRef);

    if (!snapshot.exists()) {
      console.log(`⚠️ Complaint with ID ${complaintId} not found`);
      return null;
    }

    const data = snapshot.data();

    // Handle both nested (new mobile app) and flat (legacy) structures
    const complaint: UserComplaint = {
      complaintId: data.complaintId || snapshot.id,
      category: data.category || 'Unknown',
      // Handle nested location.city or flat city field
      city: data.location?.city || data.city || extractCityFromAddress(data.location?.address || data.address) || data.ward || 'Unknown',
      // Handle nested location.pincode or flat pincode field
      pincode: data.location?.pincode || data.pincode || parseAddress(data.location?.address || data.address).pincode || 'Unknown',
      description: data.description || 'No description provided',
      createdAt: data.createdAt || data.timeline?.created,
      // Handle nested user.id or flat userId field
      userId: data.user?.id || data.userId || 'Unknown',
      // Handle nested user.name or flat userName field
      userName: data.user?.name || data.userName || 'Anonymous',
      // Handle nested user.phone or flat userPhone field
      userPhone: data.user?.phone || data.userPhone || 'Not provided',
      // Handle nested location.coordinates or flat lat/lng fields
      latitude: data.location?.coordinates?.lat || data.latitude || 0,
      longitude: data.location?.coordinates?.lng || data.longitude || 0,
      imageUrl: data.imageUrl || data.images?.[0] || '',
      // Additional fields
      status: data.status || 'Open',
      priority: data.priority || 'Medium',
      department: data.department || 'Not assigned',
      // Handle nested location.address or flat address field
      address: data.location?.address || data.address || 'Address not provided',
      ward: data.ward || data.city || 'Unknown',
      updatedAt: data.updatedAt || data.timeline?.lastUpdated
    };

    console.log(`✅ Fetched complaint ${complaintId}`);
    return complaint;

  } catch (error) {
    console.error(`❌ Error fetching complaint ${complaintId}:`, error);
    throw new Error(`Failed to fetch complaint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Gets complaint statistics
 * @param filters - Optional filters to apply
 * @returns Promise<object> - Statistics about complaints
 */
export const getUserComplaintStats = async (filters: ComplaintFilters = {}): Promise<{
  total: number;
  byCategory: Record<string, number>;
  byCity: Record<string, number>;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}> => {
  try {
    const complaints = await fetchUserComplaints({ filters, limitCount: 1000 });

    const stats = {
      total: complaints.length,
      byCategory: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>
    };

    complaints.forEach(complaint => {
      // Count by category
      stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;

      // Count by city
      stats.byCity[complaint.city] = (stats.byCity[complaint.city] || 0) + 1;

      // Count by status
      stats.byStatus[complaint.status || 'Unknown'] = (stats.byStatus[complaint.status || 'Unknown'] || 0) + 1;

      // Count by priority
      stats.byPriority[complaint.priority || 'Unknown'] = (stats.byPriority[complaint.priority || 'Unknown'] || 0) + 1;
    });

    console.log('📊 Generated complaint statistics');
    return stats;

  } catch (error) {
    console.error('❌ Error generating complaint statistics:', error);
    throw new Error(`Failed to generate statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  fetchUserComplaints,
  listenToUserComplaints,
  fetchUserComplaintById,
  getUserComplaintStats
};