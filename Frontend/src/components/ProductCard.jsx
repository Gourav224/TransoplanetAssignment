const ProductCard = ({ product }) => {
    return (
        <div className="border rounded p-4 bg-white flex gap-4">
            <div className="w-[20%] h-48">
                <img
                    src={product.image}
                    alt={product.title}
                    className="mb-2 w-full h-48 object-cover"
                />
            </div>
            <div className="w-[70%]">
                {" "}
                <h2 className="text-2xl font-semibold">{product.title}</h2>
                {product.summary && <p className="text-lg">{product.summary}</p>}
            </div>
        </div>
    );
};

export default ProductCard;
