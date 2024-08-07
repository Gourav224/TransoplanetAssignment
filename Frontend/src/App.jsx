import { useState } from "react";
import ProductCard from "./components/ProductCard";
import { fetchXML, fetchProductContent, summarizeContent } from "./api.js";
import * as Xml from "xml-js";

const App = () => {
    const [sitemapUrl, setSitemapUrl] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchProducts = async () => {
        setLoading(true);
        try {
            const xmlData = await fetchXML(sitemapUrl);
            const jsonData = Xml.xml2json(xmlData, {
                compact: true,
                spaces: 4,
            });

            const parsedData = JSON.parse(jsonData);

            const urlset = parsedData.urlset.url.slice(1,6);
            console.log(urlset);

            const productUrls = Array.isArray(urlset) ? urlset : [urlset];

            const productData = productUrls.map((product) => {
                const loc = product.loc._text;
                const image = product["image:image"]
                    ? product["image:image"]["image:loc"]._text
                    : "";
                const title = product["image:image"]
                    ? product["image:image"]["image:title"]._text
                    : "";

                return {
                    loc,
                    title,
                    image,
                };
            });
            console.log(productData);

            const productsWithDetails = await Promise.all(
                productData.map(async (product) => {
                    const content = await fetchProductContent(product.loc);
                    console.log(content);
                    
                    const summary = await summarizeContent(content);
                    return { ...product, summary };
                })
            );

            setProducts(productsWithDetails);
        } catch (error) {
            console.error("Error fetching or processing products:", error);
        } finally {
            setLoading(false);
        }
    };
    console.log(products)

    return (
        <div className="container mx-auto p-4 w-full min-h-screen">
            <input
                type="text"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="Enter product sitemap URL"
                className="border p-2 w-full mb-4"
            />
            <button
                onClick={handleFetchProducts}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Fetch Products
            </button>
            {loading && <p>Loading...</p>}
            <div className="mt-8 flex flex-col gap-4">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default App;
