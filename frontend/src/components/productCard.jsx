export function ProductCard(props) {
    return (
        <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            
            <img
                src={props.imageUrl}
                alt={props.name}
                className="w-full h-48 object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {props.name}
                </h2>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {props.description}
                </p>

                <span className="text-xl font-bold text-green-600">
                    Rs. {props.price}
                </span>
            </div>
        </div>
    );
}
