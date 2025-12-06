export const orderConfirmedTemplate = (user, order) => `
    <h2>Hello Thanks for visiting Comforty Store ${user.name},</h2>
    <p>Your order <b>${order._id}</b> has been confirmed!</p>

    <h3>Order Summary:</h3>
    <ul>
        ${order.products.map(item => 
            `<li>${item.quantity} × ${item.product.name} — $${item.price}</li>`
        ).join("")}
    </ul>

    <p>Total Price: <b>$${order.totalPrice}</b></p>

    <p>Thank you for shopping with Comforty!</p>
    <p> For any query/complain Please feel free to contact with us:</>
    <p> email: ahmedkhanofficials@gmail.com </p>
`;
