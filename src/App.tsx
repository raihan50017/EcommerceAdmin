import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ECommerce from "./pages/Dashboard/ECommerce";
import DefaultLayout from "./layout/DefaultLayout";
import AuthProvider from "./lib/auth-provider";
import PrivateRoute from "./components/PrivateRoute";
import PostIndex from "./pages/post/post-index";
import PostCRUD from "./pages/post/post-crud";
import Home from "./pages/Home/Home";
import GeneralLayout from "./layout/GeneralLayout";
import CategoryIndex from "./pages/category/category-index";
import CategoryCRUD from "./pages/category/category-crud";
import BrandIndex from "./pages/brand/brand-index";
import BrandCRUD from "./pages/brand/brand-crud";
import ColorIndex from "./pages/color/color-index";
import ColorCRUD from "./pages/color/color-crud";
import SizeIndex from "./pages/size/size-index";
import SizeCRUD from "./pages/size/size-crud";
import ProductIndex from "./pages/product/product-index";
import ProductCRUD from "./pages/product/product-crud";
import ProductVariantIndex from "./pages/product-variant/product-variant-index";
import ProductVariantCRUD from "./pages/product-variant/product-variant-crud";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    // <DefaultLayout>
    <AuthProvider>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />

        <Route path="/" element={<GeneralLayout></GeneralLayout>}>
          <Route index element={
            <>
              <PageTitle title="Home" />
              <Home />
            </>
          }
          />
        </Route>
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DefaultLayout />}>
            <Route path="post">
              <Route
                index
                element={
                  <>
                    <PageTitle title="Post" />
                    <PostIndex />
                  </>
                }
              />
              <Route path=":pageAction/:id" element={<PostCRUD />} />
            </Route>

            <Route path="category">
              <Route
                index
                element={
                  <>
                    <PageTitle title="Category" />
                    <CategoryIndex />
                  </>
                }
              />
              <Route path=":pageAction/:id" element={<CategoryCRUD />} />
            </Route>

            <Route path="brand">
              <Route
                index
                element={
                  <>
                    <PageTitle title="Brand" />
                    <BrandIndex />
                  </>
                }
              />
              <Route path=":pageAction/:id" element={<BrandCRUD />} />
            </Route>

            <Route path="color">
              <Route
                index
                element={
                  <>
                    <PageTitle title="Color" />
                    <ColorIndex />
                  </>
                }
              />
              <Route path=":pageAction/:id" element={<ColorCRUD />} />
            </Route>

            <Route path="size">
              <Route
                index
                element={
                  <>
                    <PageTitle title="Size" />
                    <SizeIndex />
                  </>
                }
              />
              <Route path=":pageAction/:id" element={<SizeCRUD />} />
            </Route>

            <Route path="product">
              <Route
                index
                element={
                  <>
                    <PageTitle title="Product" />
                    <ProductIndex />
                  </>
                }
              />
              <Route path=":pageAction/:id" element={<ProductCRUD />} />
            </Route>

            <Route path="product-variant">
              <Route
                index
                element={
                  <>
                    <PageTitle title="Product Variant" />
                    <ProductVariantIndex />
                  </>
                }
              />
              <Route path=":pageAction/:id" element={<ProductVariantCRUD />} />
            </Route>

            <Route
              index
              element={
                <>
                  <PageTitle title="Ecommerce Dashboard" />
                  <ECommerce />
                </>
              }
            />

          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
