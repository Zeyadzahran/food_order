async function testAPI() {
    console.log('--- STARTING API TESTS ---');

    const BASE_URL = 'http://localhost:5000/api';
    let token = '';
    let categoryId = '';
    let menuItemId = '';
    
    try {
        // 1. Login as Admin
        console.log('\\n1. Testing Admin Login');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@food.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
            console.log('✅ Admin login successful');
            token = loginData.data.token;
        } else {
            console.error('❌ Admin login failed', loginData);
            return;
        }

        // 2. Get Categories
        console.log('\\n2. Testing GET /api/categories');
        const getCategoriesRes = await fetch(`${BASE_URL}/categories`);
        const categoriesData = await getCategoriesRes.json();
        if (categoriesData.success && categoriesData.data.length > 0) {
            console.log(`✅ Fetched ${categoriesData.data.length} categories`);
            categoryId = categoriesData.data[0]._id;
        } else {
            console.error('❌ GET categories failed', categoriesData);
        }

        // 3. Get Menu
        console.log('\\n3. Testing GET /api/menu');
        const getMenuRes = await fetch(`${BASE_URL}/menu`);
        const menuData = await getMenuRes.json();
        if (menuData.success && menuData.data.items.length > 0) {
            console.log(`✅ Fetched ${menuData.data.items.length} menu items`);
            menuItemId = menuData.data.items[0]._id;
        } else {
            console.error('❌ GET menu failed', menuData);
        }

        // 4. Register new user
        console.log('\\n4. Testing POST /api/auth/register');
        const testUserEmail = `testuser${Date.now()}@example.com`;
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: testUserEmail,
                password: 'password123'
            })
        });
        const regData = await regRes.json();
        let userToken = '';
        if (regData.success) {
            console.log('✅ User registered successfully');
            userToken = regData.data.token;
        } else {
            console.error('❌ User registration failed', regData);
        }

        // 5. Add to Cart (as new user)
        console.log('\\n5. Testing POST /api/cart');
        const addToCartRes = await fetch(`${BASE_URL}/cart`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                menuItemId: menuItemId,
                quantity: 2
            })
        });
        const cartData = await addToCartRes.json();
        if (cartData.success) {
            console.log('✅ Added to cart successfully');
        } else {
            console.error('❌ Add to cart failed', cartData);
        }

        // 6. Place Order
        console.log('\\n6. Testing POST /api/orders');
        const orderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                paymentMethod: 'cash_on_delivery',
                deliveryAddress: {
                    street: '123 Test St',
                    city: 'Cairo',
                    phone: '01000000000'
                }
            })
        });
        const orderData = await orderRes.json();
        let orderId = '';
        if (orderData.success) {
            console.log('✅ Order placed successfully');
            orderId = orderData.data._id;
        } else {
            console.error('❌ Place order failed', orderData);
        }

        // 7. Admin Update Order Status
        console.log('\\n7. Testing Admin PATCH /api/admin/orders/:id/status');
        const updateOrderRes = await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                status: 'confirmed'
            })
        });
        const updateData = await updateOrderRes.json();
        if (updateData.success && updateData.data.status === 'confirmed') {
            console.log('✅ Admin updated order status successfully');
        } else {
            console.error('❌ Admin update order failed', updateData);
        }

        console.log('\\n🎉 All tests completed!');

    } catch (err) {
        console.error('Test execution failed:', err);
    }
}

testAPI();