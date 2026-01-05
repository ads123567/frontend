import { useState } from "react";
import { changePasswordUser } from "../api";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
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

        if (formData.new_password !== formData.confirm_password) {
            setError("New passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await changePasswordUser({
                old_password: formData.old_password,
                new_password: formData.new_password
            });
            setSuccess("Password changed successfully!");
            setFormData({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            setError(err.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Change Password</h1>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Old Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="old_password"
                            required
                            value={formData.old_password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="confirm_password"
                            required
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 font-medium"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
