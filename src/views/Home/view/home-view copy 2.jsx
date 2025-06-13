import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    TextField,
    Grid,
    Container,
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Chip,
    Paper,
    Divider,
    Avatar,
    Rating,
    InputAdornment,
    BottomNavigation,
    BottomNavigationAction,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material';
import {
    Search,
    ShoppingCart,
    Home,
    Explore,
    Person,
    Add,
    Remove,
    LocationOn,
    Star,
    Favorite,
    FavoriteBorder,
    Menu,
    Notifications
} from '@mui/icons-material';

const FarmersMarketplace = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentView, setCurrentView] = useState('home');
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Dummy data
    const products = [
        {
            id: 1,
            name: 'Fresh Berries',
            price: 500,
            rating: 4.5,
            reviews: 572,
            image: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=200&h=150&fit=crop',
            category: 'Fruits',
            farmer: 'John Smith',
            location: 'California Farm'
        },
        {
            id: 2,
            name: 'Fresh Apples',
            price: 120,
            rating: 4.2,
            reviews: 189,
            image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&h=150&fit=crop',
            category: 'Fruits',
            farmer: 'Sarah Wilson',
            location: 'Washington Orchards'
        },
        {
            id: 3,
            name: 'Juicy Oranges',
            price: 100,
            rating: 4.6,
            reviews: 230,
            image: 'https://images.unsplash.com/photo-1693266290145-44e340b8a920?q?w=200&h=150&fit=crop',
            category: 'Fruits',
            farmer: 'Priya Sharma',
            location: 'Maharashtra Groves'
        },
        {
            id: 4,
            name: 'Organic Mangoes',
            price: 300,
            rating: 4.8,
            reviews: 450,
            image: 'https://images.unsplash.com/photo-1590502593741-bb7d4aa78f8d?w=200&h=150&fit=crop',
            category: 'Fruits',
            farmer: 'Raj Patel',
            location: 'Gujarat Orchards'
        },
        {
            id: 5,
            name: 'Golden Wheat',
            price: 600,
            rating: 4.9,
            reviews: 298,
            image: '/api/placeholder/200/150',
            category: 'Grains',
            farmer: 'David Miller',
            location: 'Kansas Fields'
        },
        {
            id: 6,
            name: 'Fresh Apples',
            price: 120,
            rating: 4.2,
            reviews: 189,
            image: '/api/placeholder/200/150',
            category: 'Fruits',
            farmer: 'Sarah Wilson',
            location: 'Washington Orchards'
        }
    ];

    const categories = ['All', 'Fruits', 'Vegetables', 'Grains', 'Herbs', 'Dairy'];

    const reviews = [
        {
            id: 1,
            productId: 1,
            userName: 'Alice Johnson',
            rating: 5,
            comment: 'Amazing fresh berries! The quality is outstanding and they arrived perfectly ripe.',
            date: '2024-05-15',
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 2,
            productId: 1,
            userName: 'Mike Chen',
            rating: 4,
            comment: 'Great taste and freshness. Will definitely order again.',
            date: '2024-05-12',
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 3,
            productId: 2,
            userName: 'Emma Davis',
            rating: 5,
            comment: 'Best organic tulsi I have ever purchased. Highly recommended!',
            date: '2024-05-10',
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 4,
            productId: 3,
            userName: 'James Wilson',
            rating: 5,
            comment: 'Fresh farm milk with rich taste. Kids love it!',
            date: '2024-05-08',
            avatar: '/api/placeholder/40/40'
        }
    ];

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const updateCartQuantity = (productId, change) => {
        setCartItems(cartItems.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const toggleFavorite = (productId) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const openReviews = (product) => {
        setSelectedProduct(product);
        setReviewDialogOpen(true);
    };

    const getProductReviews = (productId) => {
        return reviews.filter(review => review.productId === productId);
    };

    // Header Component
    const Header = () => (
        <AppBar position="fixed" sx={{ backgroundColor: '#4CAF50' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Farmers
                </Typography>
                <IconButton color="inherit">
                    <Badge badgeContent={2} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>
                <IconButton color="inherit" onClick={() => setCurrentView('cart')}>
                    <Badge badgeContent={cartItems.length} color="error">
                        <ShoppingCart />
                    </Badge>
                </IconButton>
            </Toolbar>
        </AppBar>
    );

    // Home View
    const HomeView = () => (
        <Container maxWidth="lg" sx={{ mt: isMobile ? 10 : 12, mb: isMobile ? 10 : 4 }}>
            {/* Hero Section */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Are you a Farmer?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Sell your Products here
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: 'white', color: '#4CAF50' }}>
                    Get Started
                </Button>
            </Paper>

            {/* Search Bar */}
            <TextField
                fullWidth
                placeholder="Search products..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    )
                }}
                sx={{ mb: 3 }}
            />

            {/* Categories */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Categories
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto' }}>
                {categories.map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        variant="outlined"
                        sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
                    />
                ))}
            </Box>

            {/* Products Grid */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Browse Products
            </Typography>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={6} sm={4} md={3} key={product.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="120"
                                    image={product.image}
                                    alt={product.name}
                                    sx={{ backgroundColor: '#f5f5f5' }}
                                />
                                <IconButton
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={() => toggleFavorite(product.id)}
                                >
                                    {favorites.has(product.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                                </IconButton>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                    ₹{product.price}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                                    <Typography variant="caption" sx={{ ml: 1 }}>
                                        ({product.reviews})
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        fullWidth
                                        sx={{ backgroundColor: '#4CAF50', fontSize: '0.7rem' }}
                                        onClick={() => addToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ fontSize: '0.7rem', minWidth: 'auto' }}
                                        onClick={() => openReviews(product)}
                                    >
                                        Reviews
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );

    // Cart View
    const CartView = () => (
        <Container maxWidth="md" sx={{ mt: isMobile ? 8 : 12, mb: isMobile ? 10 : 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Shopping Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#4CAF50' }}
                        onClick={() => setCurrentView('home')}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <Card key={item.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={3}>
                                        <CardMedia
                                            component="img"
                                            height="60"
                                            image={item.image}
                                            alt={item.name}
                                            sx={{ borderRadius: 1, backgroundColor: '#f5f5f5' }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ₹{item.price} each
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateCartQuantity(item.id, -1)}
                                                >
                                                    <Remove />
                                                </IconButton>
                                                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateCartQuantity(item.id, 1)}
                                                >
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                                            ₹{item.price * item.quantity}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}

                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Subtotal:</Typography>
                            <Typography>₹{getTotalPrice()}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Delivery:</Typography>
                            <Typography>₹40</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>GST:</Typography>
                            <Typography>₹{Math.round(getTotalPrice() * 0.18)}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Total:</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                ₹{getTotalPrice() + 40 + Math.round(getTotalPrice() * 0.18)}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ backgroundColor: '#4CAF50' }}
                            onClick={() => setCheckoutOpen(true)}
                        >
                            Proceed to Checkout
                        </Button>
                    </Paper>
                </>
            )}
        </Container>
    );

    // Bottom Navigation for Mobile
    const MobileBottomNav = () => (
        <BottomNavigation
            value={currentView}
            onChange={(event, newValue) => setCurrentView(newValue)}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: { xs: 'flex', md: 'none' }
            }}
        >
            <BottomNavigationAction label="Home" value="home" icon={<Home />} />
            <BottomNavigationAction label="Explore" value="explore" icon={<Explore />} />
            <BottomNavigationAction
                label="Cart"
                value="cart"
                icon={
                    <Badge badgeContent={cartItems.length} color="error">
                        <ShoppingCart />
                    </Badge>
                }
            />
            <BottomNavigationAction label="Profile" value="profile" icon={<Person />} />
        </BottomNavigation>
    );

    // Reviews Dialog
    const ReviewsDialog = () => (
        <Dialog
            open={reviewDialogOpen}
            onClose={() => setReviewDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={selectedProduct?.image} />
                    <Box>
                        <Typography variant="h6">{selectedProduct?.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={selectedProduct?.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                ({selectedProduct?.reviews} reviews)
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>
                <List>
                    {getProductReviews(selectedProduct?.id).map((review) => (
                        <ListItem key={review.id} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar src={review.avatar}>{review.userName[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Typography variant="subtitle2">{review.userName}</Typography>
                                        <Rating value={review.rating} size="small" readOnly />
                                    </Box>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            {review.comment}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(review.date).toLocaleDateString()}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setReviewDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );

    // Checkout Dialog
    const CheckoutDialog = () => (
        <Dialog
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
        >
            <DialogTitle>Checkout</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Delivery Address</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        defaultValue="70 Washington Square South, New York, NY 10012, United States"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        defaultValue="+91 12345 67890"
                    />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                {cartItems.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{item.name} x{item.quantity}</Typography>
                        <Typography>₹{item.price * item.quantity}</Typography>
                    </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                        ₹{getTotalPrice() + 40 + Math.round(getTotalPrice() * 0.18)}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#4CAF50' }}
                    onClick={() => {
                        setCheckoutOpen(false);
                        setCartItems([]);
                        alert('Order placed successfully!');
                    }}
                >
                    Place Order
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box sx={{ minHeight: '70vh', backgroundColor: '#f8f9fa' }}>
            <Header />

            {currentView === 'home' && <HomeView />}
            {currentView === 'cart' && <CartView />}

            {isMobile && <MobileBottomNav />}

            <ReviewsDialog />
            <CheckoutDialog />
        </Box>
    );
};

export default FarmersMarketplace;