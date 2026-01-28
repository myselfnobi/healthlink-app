export const hospitals = [
    {
        id: 'h1',
        name: 'City Care Hospital',
        address: 'Madhapur, Hyderabad',
        distance: '2.5 km',
        rating: 4.5,
        isOpen: true,
        hasEmergency: true,
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b9af923?auto=format&fit=crop&q=80&w=500',
        doctors: [
            {
                id: 'd1',
                name: 'Dr. Sarah Smith',
                specialty: 'Cardiologist',
                status: 'Available',
                availability: {
                    busy: ['11:00 AM', '04:00 PM'],
                    available: ['09:00 AM', '10:00 AM', '12:00 PM', '05:00 PM', '06:00 PM']
                }
            },
            {
                id: 'd2',
                name: 'Dr. John Doe',
                specialty: 'General Physician',
                status: 'In Appointment',
                availability: {
                    busy: ['09:00 AM', '10:00 AM', '11:00 AM'],
                    available: ['12:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
                }
            }
        ]
    },
    {
        id: 'h2',
        name: 'Sunshine Medical Center',
        address: 'Gachibowli, Hyderabad',
        distance: '4.2 km',
        rating: 4.2,
        isOpen: true,
        hasEmergency: false,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=500',
        doctors: [
            {
                id: 'd3',
                name: 'Dr. Emily Brown',
                specialty: 'Pediatrician',
                status: 'Available',
                availability: {
                    busy: [],
                    available: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM']
                }
            }
        ]
    },
    {
        id: 'h3',
        name: 'Green Valley Clinic',
        address: 'Jubilee Hills, Hyderabad',
        distance: '6.0 km',
        rating: 4.8,
        isOpen: false,
        hasEmergency: true,
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=500',
        doctors: [
            {
                id: 'd4',
                name: 'Dr. Michael Chen',
                specialty: 'Ophthalmologist',
                status: 'Available',
                availability: {
                    busy: ['02:00 PM'],
                    available: ['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM']
                }
            }
        ]
    },
    {
        id: 'h4',
        name: 'Apollo Spectra',
        address: 'Kondapur, Hyderabad',
        distance: '1.2 km',
        rating: 4.6,
        isOpen: true,
        hasEmergency: true,
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0674c6c?auto=format&fit=crop&q=80&w=500',
        doctors: [
            {
                id: 'd5',
                name: 'Dr. Robert Wilson',
                specialty: 'General Physician',
                status: 'Available',
                availability: {
                    busy: [],
                    available: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM']
                }
            }
        ]
    },
    {
        id: 'h5',
        name: 'Local Community Health',
        address: 'Miyapur, Hyderabad',
        distance: '3.8 km',
        rating: 4.0,
        isOpen: true,
        hasEmergency: false,
        image: 'https://images.unsplash.com/photo-1519494083224-7236dacc6f02?auto=format&fit=crop&q=80&w=500',
        doctors: [
            {
                id: 'rmp1',
                name: 'Rahul Kumar (RMP)',
                specialty: 'RMP Doctor',
                status: 'Available',
                availability: {
                    busy: [],
                    available: ['08:00 AM', '09:00 AM', '10:00 AM', '05:00 PM']
                }
            }
        ]
    }
];
export const medicalStores = [
    {
        id: 's1',
        name: 'Apollo Pharmacy',
        address: 'Hitech City, Hyderabad',
        distance: '0.8 km',
        rating: 4.8,
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=500',
        deliveryTime: '20-30 mins',
        priceScore: 85, // Higher = better price/value
        deliveryFee: 20
    },
    {
        id: 's2',
        name: 'MedPlus',
        address: 'Kondapur, Hyderabad',
        distance: '1.5 km',
        rating: 4.5,
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=500',
        deliveryTime: '15-25 mins',
        priceScore: 92,
        deliveryFee: 15
    },
    {
        id: 's3',
        name: 'Wellness Forever',
        address: 'Madhapur, Hyderabad',
        distance: '2.1 km',
        rating: 4.7,
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=500',
        deliveryTime: '30-40 mins',
        priceScore: 78,
        deliveryFee: 40
    },
    {
        id: 's4',
        name: 'Local Generic Store',
        address: 'Miyapur, Hyderabad',
        distance: '3.5 km',
        rating: 4.0,
        isOpen: false,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=500',
        deliveryTime: '45-55 mins',
        priceScore: 98,
        deliveryFee: 10
    }
];
