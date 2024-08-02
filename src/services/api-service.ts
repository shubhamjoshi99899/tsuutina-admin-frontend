import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define types
interface Route {
  _id?: string;
  name: string;
  path: string;
  icon: string;
  isCurrentlyUsed: boolean;
}

interface Layout {
  _id: string;
  name: string;
  routes: Route[];
  isCurrentlySet: boolean;
}

interface Image {
  _id?: string;
  url: string;
  isVisible: boolean;
}

interface Carousel {
  _id: string;
  name: string;
  images: Image[];
  isActive: boolean;
}

interface HistoryItem {
  _id?: string;
  title: string;
  yearsFrom: number;
  yearsUpto: number;
  image: string;
  description: string;
  index: number;
  isCurrentlyVisible: boolean;
}

interface DirectoryItem {
  _id?: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  image?: string;
  hours: string;
  iframe: string;
}

interface FormField {
  _id?: string;
  label: string;
  type: string;
  options?: string[];
  required: boolean;
  isActive: boolean;
}

export interface Form {
  _id?: string;
  title: string;
  description: string;
  fields: FormField[];
  isActive: boolean;
}

interface Response {
  formId: string;
  responses: Record<string, string>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/api', // Replace with your base URL
    });
  }

  // Layout API Methods

  getLayouts(): Promise<AxiosResponse<ApiResponse<Layout[]>>> {
    return this.axiosInstance.get('/layouts');
  }

  getCurrentLayout(): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.get('/layouts/current');
  }

  createLayout(data: { name: string; routes: Partial<Route>[] }): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.post('/layouts', data);
  }

  setLayout(id: string): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.put(`/layouts/${id}`);
  }

  updateLayout(id: string, data: { routes: Partial<Route>[] }): Promise<AxiosResponse<ApiResponse<Layout>>> {
    const routesWithoutId = data.routes.map(({ _id, ...rest }) => rest);
    return this.axiosInstance.put(`/layouts/${id}`, { routes: routesWithoutId });
  }

  addRouteToLayout(layoutId: string, routeData: Route): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.post(`/layouts/${layoutId}/routes`, routeData);
  }

  removeRouteFromLayout(layoutId: string, routeId: string): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.delete(`/layouts/${layoutId}/routes/${routeId}`);
  }

  updateLayoutRoute(
    id: string,
    routeId: string,
    data: { isCurrentlyUsed: boolean }
  ): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.put(`/layouts/${id}/routes/${routeId}`, data);
  }

  getLayoutById(id: string): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.get(`/layouts/${id}`);
  }

  deleteLayout(id: string): Promise<AxiosResponse<ApiResponse<Layout>>> {
    return this.axiosInstance.delete(`/layouts/${id}`);
  }

  // Carousel API Methods

  getCarousels(): Promise<AxiosResponse<ApiResponse<Carousel[]>>> {
    return this.axiosInstance.get('/carousels');
  }

  getCarouselById(id: string): Promise<AxiosResponse<ApiResponse<Carousel>>> {
    return this.axiosInstance.get(`/carousels/${id}`);
  }

  createCarousel(data: { name: string; images: Image[] }): Promise<AxiosResponse<ApiResponse<Carousel>>> {
    return this.axiosInstance.post('/carousels', data);
  }

  updateCarousel(id: string, data: Partial<Carousel>): Promise<AxiosResponse<ApiResponse<Carousel>>> {
    return this.axiosInstance.put(`/carousels/${id}`, data);
  }

  deleteCarousel(id: string): Promise<AxiosResponse<ApiResponse<Carousel>>> {
    return this.axiosInstance.delete(`/carousels/${id}`);
  }

  addImageToCarousel(carouselId: string, data: Image): Promise<AxiosResponse<ApiResponse<Carousel>>> {
    return this.axiosInstance.post(`/carousels/${carouselId}/images`, data);
  }

  removeImageFromCarousel(carouselId: string, imageId: string): Promise<AxiosResponse<ApiResponse<Carousel>>> {
    return this.axiosInstance.delete(`/carousels/${carouselId}/images/${imageId}`);
  }

  setCarouselActive(id: string): Promise<AxiosResponse<ApiResponse<Carousel>>> {
    return this.axiosInstance.put(`/carousels/${id}/set`);
  }

  getHistoryItems(): Promise<AxiosResponse<ApiResponse<HistoryItem[]>>> {
    return this.axiosInstance.get('/history');
  }

  getHistoryItemById(id: string): Promise<AxiosResponse<ApiResponse<HistoryItem>>> {
    return this.axiosInstance.get(`/history/${id}`);
  }

  createHistoryItem(data: HistoryItem): Promise<AxiosResponse<ApiResponse<HistoryItem>>> {
    return this.axiosInstance.post('/history', data);
  }

  updateHistoryItem(id: string, data: Partial<HistoryItem>): Promise<AxiosResponse<ApiResponse<HistoryItem>>> {
    return this.axiosInstance.put(`/history/${id}`, data);
  }

  deleteHistoryItem(id: string): Promise<AxiosResponse<ApiResponse<HistoryItem>>> {
    return this.axiosInstance.delete(`/history/${id}`);
  }

  getDirectoryItems(): Promise<AxiosResponse<ApiResponse<DirectoryItem[]>>> {
    return this.axiosInstance.get('/directories');
  }

  getDirectoryItemById(id: string): Promise<AxiosResponse<ApiResponse<DirectoryItem>>> {
    return this.axiosInstance.get(`/directories/${id}`);
  }

  createDirectoryItem(data: DirectoryItem): Promise<AxiosResponse<ApiResponse<DirectoryItem>>> {
    return this.axiosInstance.post('/directories', data);
  }

  updateDirectoryItem(id: string, data: Partial<DirectoryItem>): Promise<AxiosResponse<ApiResponse<DirectoryItem>>> {
    return this.axiosInstance.put(`/directories/${id}`, data);
  }

  deleteDirectoryItem(id: string): Promise<AxiosResponse<ApiResponse<DirectoryItem>>> {
    return this.axiosInstance.delete(`/directories/${id}`);
  }

  getForms(): Promise<AxiosResponse<ApiResponse<Form[]>>> {
    return this.axiosInstance.get('/forms');
  }

  getFormById(id: string): Promise<AxiosResponse<ApiResponse<Form>>> {
    return this.axiosInstance.get(`/forms/${id}`);
  }

  createForm(form: Form): Promise<AxiosResponse<ApiResponse<Form>>> {
    return this.axiosInstance.post('/forms', form);
  }

  updateForm(id: string, form: Form): Promise<AxiosResponse<ApiResponse<Form>>> {
    return this.axiosInstance.put(`/forms/${id}`, form);
  }

  deleteForm(id: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.axiosInstance.delete(`/forms/${id}`);
  }

  getResponsesByFormId(formId: string): Promise<AxiosResponse<ApiResponse<Response[]>>> {
    return this.axiosInstance.get(`/responses/form/${formId}`);
  }
}

export default new ApiService();
