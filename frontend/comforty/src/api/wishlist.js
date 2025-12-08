// Wishlist functionality using localStorage (no backend API available)
const WISHLIST_KEY = 'comforty_wishlist';

export const getWishlist = () => {
  try {
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

export const addToWishlist = (product) => {
  try {
    const wishlist = getWishlist();
    const exists = wishlist.find(item => item._id === product._id || item.id === product.id);
    
    if (!exists) {
      const productToAdd = {
        _id: product._id || product.id,
        id: product._id || product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        images: product.images || [],
      };
      wishlist.push(productToAdd);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
    return wishlist;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return getWishlist();
  }
};

export const removeFromWishlist = (productId) => {
  try {
    const wishlist = getWishlist();
    const filtered = wishlist.filter(item => 
      (item._id && item._id.toString() !== productId.toString()) &&
      (item.id && item.id.toString() !== productId.toString())
    );
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return getWishlist();
  }
};

export const isInWishlist = (productId) => {
  try {
    const wishlist = getWishlist();
    return wishlist.some(item => 
      (item._id && item._id.toString() === productId.toString()) ||
      (item.id && item.id.toString() === productId.toString())
    );
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

export const clearWishlist = () => {
  try {
    localStorage.removeItem(WISHLIST_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return [];
  }
};

