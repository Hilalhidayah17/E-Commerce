import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const initialState = {
  products: [],
  productsCart: [],
  totalPage: 0,
  productById: {},
  loading: false,
  params: {
    sortPrice: "",
    query: "",
    sizeFilter: [],
    genderFilter: [],
    typeFilter: [],
    currentPage: 1,
  },
};

const productSlice = createSlice({
  name: `product`,
  initialState,
  reducers: {
    setParams: (state, action) => {
      state.params = { ...state.params, ...action.payload };
    },
    setProduct: (state, action) => {
      state.products = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    addToCart: (state, action) => {
      const { id, sizes } = action.payload;

      // Cek apakah produk dengan ID & size yang sama sudah ada di cart
      const existingItemIndex = state.productsCart.findIndex(
        (item) => item.id === id && item.sizes === sizes
      );

      if (existingItemIndex !== -1) {
        // Jika sudah ada, update quantity
        state.productsCart[existingItemIndex].quantity +=
          action.payload.quantity;
      } else {
        // Jika belum ada, tambahkan ke cart
        state.productsCart.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.productsCart = state.productsCart.filter(
        (item) => item.id !== action.payload
      );
    },
    clearCart: (state) => {
      state.productsCart = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(readProductsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(readProductsThunk.fulfilled, (state, action) => {
      state.products = action.payload.productsArray;
      state.totalPage = action.payload.totalPage;
      state.loading = false;
    });
    builder.addCase(getProductByIdThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductByIdThunk.fulfilled, (state, action) => {
      state.productById = action.payload;
      state.loading = false;
    });
    builder.addCase(editProductByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
    });
  },
});

// untuk read product
export const readProductsThunk = createAsyncThunk(
  "product/readProductsThunk",
  async (
    searchParams = {
      sortPrice: "",
      query: "",
      sizeFilter: [],
      genderFilter: [],
      typeFilter: [],
    },
    { rejectWithValue }
  ) => {
    try {
      const productRef = collection(db, "products");
      const conditions = [];
      const pageLimit = 8;

      const currentPage = searchParams.currentPage || 1;

      if (searchParams.sizeFilter.length > 0) {
        if (searchParams.sizeFilter.length > 5) {
          Swal.fire({
            title: "Error!",
            text: "You can only select max of 5 sizes!",
            icon: "error",
            confirmButtonText: "Click to continue",
          });
          return;
        }
        conditions.push(
          where("sizes", "array-contains-any", searchParams.sizeFilter)
        );
      }

      if (searchParams.genderFilter.length > 0) {
        conditions.push(where("gender", "in", searchParams.genderFilter));
      }

      if (searchParams.typeFilter.length > 0) {
        conditions.push(where("category", "in", searchParams.typeFilter));
      }

      if (searchParams.sortPrice) {
        conditions.push(orderBy("price", searchParams.sortPrice));
      }
      // jika ada search query
      let productsArray = [];
      if (searchParams.query) {
        const querySnapshot = await getDocs(collection(db, "products"));
        productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        productsArray = productsArray.filter((items) =>
          items.name.toLowerCase().includes(searchParams.query.toLowerCase())
        );
      } else {
        let q = query(productRef, ...conditions, limit(pageLimit));

        // limitasi product

        if (currentPage > 1) {
          const prevQuery = query(
            productRef,
            ...conditions,
            limit((currentPage - 1) * pageLimit)
          );
          const prevSnapshot = await getDocs(prevQuery);

          if (!prevSnapshot.empty) {
            const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
            q = query(
              productRef,
              ...conditions,
              startAfter(lastVisible),
              limit(pageLimit)
            );
          }
        }

        const querySnapshot = await getDocs(q);
        productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // pagination
      const totalProduct = (await getDocs(query(productRef, ...conditions)))
        .size;
      const totalPage = searchParams.query
        ? Math.ceil(productsArray.length / pageLimit)
        : Math.ceil(totalProduct / pageLimit);

      return { productsArray, totalPage };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// untuk add product
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      await addDoc(collection(db, "products"), product);
      toast.success(`successfully added new item`);
      return product;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// untuk handle delete
export const deleteProductThunk = createAsyncThunk(
  "product/deleteProductThunk",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// handle edit
export const editProductByIdThunk = createAsyncThunk(
  "product/editProductByIdThunk",
  async ({ productId, updatedProduct }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "products", productId), updatedProduct);
      toast.success(`succesfully edited product`); // Kembalikan produk yang telah diperbarui
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// handle read products by id
export const getProductByIdThunk = createAsyncThunk(
  "product/getProductByIdThunk",
  async (productId, { rejectWithValue }) => {
    try {
      const docSnap = await getDoc(doc(db, "products", productId));
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const { setParams, setLoading, addToCart, removeFromCart } =
  productSlice.actions;
export default productSlice.reducer;
