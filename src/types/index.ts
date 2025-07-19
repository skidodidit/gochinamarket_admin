export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  role?: 'admin' | 'user';
  verified: boolean;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number; 
  ratingCount: number; 
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemPayload {
  product: string; 
  quantity: number;
}

export interface GuestInfoPayload {
  name: string;
  email: string;
  phone: string;
}

export interface CreateOrderPayload {
  user?: string; 
  guestInfo?: GuestInfoPayload;
  items: OrderItemPayload[];
  total: number;
  deliveryFee: number;
  paymentMethod: 'card' | 'transfer' | 'cash';
  proofOfPayment?: string;
  address: string;
  orderNote?: string;
  deliveryDate?: string;
}

export interface UpdateOrderStatusPayload {
  status?: 'ongoing' | 'successful' | 'cancelled' | 'failed';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  feedBack?: string;
  deliveryDate?: any;
}

export interface VerifyDeliveryCodePayload {
  code: string;
}

export interface Order {
  _id: string;
  user?: string;
  guestInfo?: GuestInfoPayload;
  items: { product: Product; quantity: number }[];
  total: number;
  deliveryFee: number;
  paymentMethod: string;
  proofOfPayment?: string;
  address: string;
  orderNote?: string;
  feedBack?: string;
  deliveryDate?: string;
  orderStatus: string;
  paymentStatus: string;
  verificationCode?: string;
  createdAt: string;
  updatedAt: string;
}
