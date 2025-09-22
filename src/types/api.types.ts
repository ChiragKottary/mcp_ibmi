// API Types for Order and Invoice Services

// Order Service Types
export interface OrderLine {
    id: string;
    lineNumber: number;
    oldLineNumber?: number;
    lineType: string;
    articleNo: string;
    articleText1?: string;
    articleText2?: string;
    unitCode?: string;
    quantity: number;
    unitPriceExVat: number;
    unitPriceIncVat: number;
    costPriceExVat: number;
    purchasePriceExVat: number;
    discountPercent1?: number;
    discountPercent2?: number;
    specialDiscountPercent1?: number;
    specialDiscountPercent2?: number;
    campaignCode?: string;
    coveragePercent?: number;
    vatPercent?: number;
    totalCostPriceExVat: number;
    totalPurchasePriceExVat: number;
    totalDiscountedPriceExVat: number;
    totalDiscountedPriceIncVat: number;
    externalLineStatus?: string;
    quantityDelivered?: number;
    quantityRemaining?: number;
    quantityInvoiced?: number;
    unitPriceOriginalExVat?: number;
    costPriceOriginalExVat?: number;
    warehouseNo?: string;
    departmentNo?: string;
    deliveryTypeCode?: string;
    deliveryTypeName?: string;
    deliveryDate?: string;
    priceCode?: string;
    vendorNumber?: string;
    externalArticle?: boolean;
    externalPriceCalculationDescription?: string;
    externalPriceCostCalculationFactor?: number;
    externalPricePurchaseCalculationFactor?: number;
    articleType?: string;
    gtinNo?: string;
    purchaseOrderNumber?: string;
    purchaseOrderLineNumber?: number;
    purchaseOrderStatus?: string;
    unitVolumeInQm?: number;
    unitWeightInKg?: number;
    parentLineNumber?: number;
    articleOrigin?: string;
    lineChosen?: boolean;
}

export interface OrderCustomer {
    customerNo: string;
    name: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    url?: string;
    email?: string;
    organizationNumber?: string;
    defaultOrderDiscountPercent?: number;
    vatFree?: boolean;
    address?: {
        name?: string;
        address1?: string;
        address2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
}

export interface OrderDetails {
    version: number;
    orderFlowIndicator: string;
    orderNo: number;
    parentOrderNo?: number;
    externalOrderReferences?: Array<{
        externalSystemCode?: string;
        externalOrderNo?: string;
        externalOrderStatus?: string;
        externalOrderType?: string;
    }>;
    departmentNo?: string;
    warehouseNo?: string;
    customer: OrderCustomer;
    articleCustomer?: {
        name?: string;
        organizationNumber?: string;
        gln?: string;
    };
    customerProject?: {
        id?: string;
        projectNo?: string;
        name?: string;
        externalProjectNo?: string;
        email?: string;
        phone?: string;
        mobile?: string;
        address?: {
            name?: string;
            address1?: string;
            address2?: string;
            postalCode?: string;
            city?: string;
            country?: string;
        };
    };
    orderDate?: string;
    deliveryDate?: string;
    expireDate?: string;
    followupDate?: string;
    deliveryType?: {
        code?: string;
        name?: string;
    };
    deliveryRouteId?: string;
    deliveryMethodId?: string;
    ourReference?: string;
    customerReference?: string;
    requisition?: string;
    information?: string;
    salesperson?: {
        code?: string;
        name?: string;
        phone?: string;
        email?: string;
    };
    responsibleSalesperson?: {
        code?: string;
        name?: string;
        phone?: string;
        email?: string;
    };
    deliveryAddress?: {
        name?: string;
        address1?: string;
        address2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
    coveragePercent?: number;
    orderDiscountPercent?: number;
    totalPurchasePriceExVat?: number;
    totalCostPriceExVat?: number;
    totalDiscountedPriceExVat?: number;
    totalDiscountedPriceIncVat?: number;
    createdTimestamp?: string;
    createdByUser?: string;
    lastChangedTimestamp?: string;
    lastChangedByUser?: string;
    deletedByUser?: string;
    deletedTime?: string;
    deletedReason?: string;
    orderInfoCode?: string;
    calculateVat?: boolean;
    automaticFee?: boolean;
    automaticInvoiceFee?: boolean;
    automaticShippingFee?: boolean;
    headerText?: string;
    footerText?: string;
    customerPaymentTermCode?: string;
    customerContact?: {
        customerContactId?: string;
        name?: string;
        phone?: string;
        email?: string;
    };
    requiredDeposit?: number;
    deductedDeposit?: number;
    remainingDeposit?: number;
    currencyCode?: string;
    targetMarginInPercent?: number;
    priceSourceOrderNo?: string;
    customerCardNumber?: string;
    orderCommands?: string[];
    orderLines?: OrderLine[];
    warehouseEmployeeText?: string;
    transportEmployeeText?: string;
    transportShipmentReference?: string;
    lockKey?: string;
    lockDetails?: {
        lockedByUser?: string;
        lockedTime?: string;
        lockSource?: string;
    };
    source?: string;
    parcels?: Array<{
        parcelType?: string;
        text?: string;
        printerName?: string;
    }>;
    quote?: boolean;
    deleted?: boolean;
    draft?: boolean;
    readyForPicking?: boolean;
    delivered?: boolean;
}

// Common API Types
export interface PaginationInfo {
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    total?: number;
    pagination?: PaginationInfo;
    timestamp?: string;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: string;
}

// Invoice Service Types
export interface Address {
    streetOrPlace?: string;
    streetNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface CustomerProject {
    projectNo?: string;
    projectName?: string;
    address?: Address;
}

export interface InvoiceSummary {
    id: string;
    invoiceNo: string;
    customerNo: string;
    customerName: string;
    invoiceDate: string;
    dueDate: string;
    amountIncVAT: number;
    amountExVAT: number;
    customerProject?: CustomerProject;
    kid?: string;
    paymentMode?: string;
}

export interface CustomerInvoicesResponse {
    offset: number;
    limit: number;
    invoiceSummaries: InvoiceSummary[];
}

// Health Check Types
export interface HealthStatus {
    status: string;
    message: string;
    timestamp: string;
}