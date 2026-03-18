// ------------------ MEDIA ------------------
export interface Media {
  _id: string;
  url: string;
  resource_type: 'image' | 'video';
  format?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------ PRODUCT ------------------
export interface OptionValue {
  valueId: string;
  valueName: string;
  imageUrl?: string;
}

export interface ProductOption {
  optionId: string;
  optionName: string;
  values: OptionValue[];
}

export interface VariantOptionValue {
  optionId: string;
  optionName: string;
  valueId: string;
  valueName: string;
}

export interface ProductVariant {
  skuCode: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl?: string;
  inStock: boolean;
  optionValues: VariantOptionValue[];
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  discount?: number;
  category: string;

  images: Media[];
  videos?: Media[];

  inStock: boolean;
  secondHand: boolean;

  isBanner: boolean;
  isAd: boolean;
  isPopup: boolean;
  popupText?: string;
  adText?: string;
  bannerText?: string;

  rating: number;
  reviews: number;
  ratingCount: number;

  options: ProductOption[];
  variants: ProductVariant[];

  createdAt?: string;
  updatedAt?: string;
}

// ------------------ SETTINGS ------------------
export interface Settings {
  _id?: string;
  siteName?: string;
  tagline?: string;
  bannerText?: string;
  supportEmail?: string;
  supportPhone?: string;
  logoUrl?: string;
  faviconUrl?: string;
  currencySymbol?: string;
  currencyCode?: string;
  maintenanceMode?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  shippingInfo?: string;
  taxInfo?: string;
  customFields?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------ CATEGORY ------------------
export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


// ------------------ ABOUT ------------------
export interface About {
  _id?: string;
  title: string;
  description: string;
  mission?: string;
  vision?: string;
  values?: string[];
  bannerImage?: string;
  videoUrl?: string;
  highlights?: {
    label: string;
    value: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

// ------------------ CONTACT ------------------
export interface Contact {
  _id?: string;
  email: string;
  phone?: string;
  address?: string;
  whatsapp?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  facebook?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------ USER ------------------
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  verified: boolean;
  role: 'user' | 'admin';
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
}

// ------------------ CART ------------------
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  guestId?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

// ------------------ ORDER ------------------
export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  skuCode?: string;
  selectedOptions?: VariantOptionValue[];
}

export interface OrderAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'card' | 'transfer' | 'cod';

export interface Order {
  _id: string;
  user?: User;
  guestId?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  address: OrderAddress;
  deliveryCode: string;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
}
