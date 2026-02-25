export function Footer() {
    return (
        <footer className="border-t bg-gray-50 ">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-lg font-semibold">Next App</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            A modern Next.js application with best practices.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium">Product</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-blue-600">Features</a></li>
                            <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium">Company</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-blue-600">About</a></li>
                            <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium">Support</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-600">Community</a></li>
                            <li><a href="#" className="hover:text-blue-600">Status</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
                    © 2024 Next App. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
