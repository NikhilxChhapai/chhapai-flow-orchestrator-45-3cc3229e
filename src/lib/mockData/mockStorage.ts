
// Mock Firebase Storage functionality

// In-memory storage for file URLs
const mockStorageUrls: Record<string, string> = {};

// Generate a dummy URL for the mock files
const generateMockUrl = (path: string): string => {
  return `https://mock-storage.example.com/${path}?t=${Date.now()}`;
};

// Mock storage reference
export const ref = (storage: any, path: string) => {
  return { path, fullPath: path };
};

// Mock uploadBytes function
export const uploadBytes = async (reference: { path: string }, file: File) => {
  const url = generateMockUrl(reference.path);
  mockStorageUrls[reference.path] = url;
  
  return {
    ref: reference,
    metadata: {
      fullPath: reference.path,
      name: reference.path.split('/').pop(),
      contentType: file.type
    }
  };
};

// Mock getDownloadURL function
export const getDownloadURL = async (reference: { path: string }) => {
  if (mockStorageUrls[reference.path]) {
    return mockStorageUrls[reference.path];
  }
  
  // If URL doesn't exist yet, create it
  const url = generateMockUrl(reference.path);
  mockStorageUrls[reference.path] = url;
  return url;
};

// Mock storage bucket
export const mockStorage = {
  ref: (path: string) => ref(null, path),
  uploadBytes,
  getDownloadURL
};

export default mockStorage;
