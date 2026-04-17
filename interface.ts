interface HotelItem {
    _id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    picture: string;
    region?: string;
    dailyrate: number;
    ratings?: {
        _id: string;
        user: string;
        hotel: string;
        score: number;
    }[];
    reviews?: ReviewItem[];
    __v: number;
    id: string;
}

interface ReviewItem {
    _id: string;
    score: number;
    comment: string;
    user: string | {
        _id: string;
        name: string;
        email: string;
    };
    hotel?: string | {
        _id: string;
        name: string;
        province: string;
    };
    likes?: string[];
    dislikes?: string[];
    createdAt: string;
}

interface HotelJson {
    success: boolean;
    count: number;
    pagination: Object;
    data: HotelItem[];
}

interface BookingItem {
    nameLastname: string;
    tel: string;
    hotel: string;
    bookDate: string;
}

interface ApiBookingItem {
    _id: string;
    apptDate: string;
    createdAt: string;
    hotel: {
        _id: string;
        name: string;
        province: string;
        tel: string;
    };
    user?: string | {
        _id: string;
        name: string;
        email: string;
    };
    id: string;
}

interface ApiBookingJson {
    success: boolean;
    count: number;
    data: ApiBookingItem[];
}

interface UserItem {
    _id: string;
    name: string;
    email: string;
    tel: string;
    role: string;
    isban: boolean;
    createdAt: string;
    id: string;
}

interface UserJson {
    success: boolean;
    count: number;
    data: UserItem[];
}
