import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { ShoppingBag, Trash, X } from "lucide-react";
import { Box, Divider, TextField } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import useWhatsAppOrder from "../../hooks/useWhatsAppOrder";

export default function CartPopover({ products }) {
  console.log(products, "<<");
  const [anchorEl, setAnchorEl] = useState(null);
  const [quantities, setQuantities] = useState({}); // Store quantity per product

  const sendOrderToWhatsApp = useWhatsAppOrder("6282132858106");

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "cart", id));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const increaseQty = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decreaseQty = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] > 1 ? prev[productId] - 1 : 1,
    }));
  };

  const open = Boolean(anchorEl);
  const id = open ? "cart-popover" : undefined;

  return (
    <div>
      {/* Button to open Popover */}
      <button
        onClick={handleClick}
        className="bg-red-500 px-2 py-2 rounded-md cursor-pointer hover:bg-red-900"
      >
        <ShoppingBag className="text-white " />
      </button>

      {/* Cart Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
            },
          },
        }}
      >
        <div>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="bold">Shopping Cart</Typography>
            <IconButton onClick={handleClose}>
              <X size={20} />
            </IconButton>
          </Box>

          {products.map((product, i) => (
            <div key={i}>
              {/* Product Info */}
              <Box display="flex" alignItems="center" gap={3} mt={2}>
                <img
                  src={product?.images?.[0]} // Ensure images exist
                  alt="Product"
                  style={{ width: 50, height: 50, borderRadius: 4 }}
                />
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>
                    {product.name}
                  </Typography>
                  <Typography color="error" fontWeight="bold">
                    Rp.{" "}
                    {Number(
                      product.price - (product.price * product.discount) / 100
                    ).toLocaleString("id-ID")}
                  </Typography>
                  <Typography fontSize={12}>Size: {product.sizes}</Typography>
                </Box>
                <Box>
                  <Trash
                    className="cursor-pointer "
                    onClick={() => {
                      handleDelete(product.id);
                    }}
                  />
                </Box>
              </Box>

              {/* Quantity Selector */}
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Typography fontSize={14}>Qty</Typography>
                <Button
                  onClick={() => decreaseQty(product.id)}
                  size="small"
                  variant="outlined"
                >
                  -
                </Button>
                <TextField
                  value={product.quantity || 1}
                  size="small"
                  sx={{ width: 40, textAlign: "center" }}
                  inputProps={{ style: { textAlign: "center" } }}
                />
                <Button
                  onClick={() => increaseQty(product.id)}
                  size="small"
                  variant="outlined"
                >
                  +
                </Button>
              </Box>

              {/* Subtotal per Product */}
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight="bold"
                mt={2}
              >
                <Typography>Subtotal:</Typography>
                <Typography>
                  Rp{" "}
                  {(
                    Number(
                      product.price - (product.price * product.discount) / 100
                    ) * (quantities[product.id] || 1)
                  ).toLocaleString("id-ID")}
                </Typography>
              </Box>
            </div>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Grand Total */}
          <Box display="flex" justifyContent="space-between" fontWeight="bold">
            <Typography>Total:</Typography>
            <Typography>
              Rp.{" "}
              {products
                .reduce(
                  (total, product) =>
                    total +
                    Number(
                      product.price - (product.price * product.discount) / 100
                    ) *
                      (quantities[product.id] || 1),
                  0
                )
                .toLocaleString("id-ID")}
            </Typography>
          </Box>
        </div>

        {/* Action Buttons */}
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "red", color: "white", my: 1 }}
          onClick={() => sendOrderToWhatsApp(products, quantities)}
        >
          BUY NOW
        </Button>
      </Popover>
    </div>
  );
}
