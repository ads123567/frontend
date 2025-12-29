import { CATEGORIES } from "@/data/mockData"

export function CategoryStrip() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    return (
                        <div
                            key={cat.id}
                            className="flex flex-col items-center gap-2 min-w-[100px] cursor-pointer group"
                        >
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${cat.color} shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}>
                                <Icon className="h-8 w-8" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 text-center group-hover:text-medical-teal-600">
                                {cat.name}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
