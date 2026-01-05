import { useState } from "react";
import { resetPasswordAdmin } from "../../api";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        email: "",
        new_password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await resetPasswordAdmin(formData);
            setSuccess("Password reset successfully!");
            setFormData({ email: "", new_password: "" });
        } catch (err) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Reset User Password (Admin)</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                {error && (
                    <div className="mb-4 bg-red-50 p-3 rounded flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-50 p-3 rounded flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Enter user's email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="new_password"
                            required
                            value={formData.new_password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
