// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rudderstackForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Function to show status message
    const showStatus = (message, type) => {
        statusMessage.textContent = message;
        statusMessage.className = `mt-4 p-3 rounded-md ${type}`;
        statusMessage.classList.remove('hidden');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    };

    // Function to reset form
    const resetForm = () => {
        form.reset();
    };

    // Function to set loading state
    const setLoading = (isLoading) => {
        if (isLoading) {
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            submitBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        } else {
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
            submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
    };

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim()
        };

        // Validate form data
        if (!formData.fullName || !formData.email || !formData.phoneNumber) {
            showStatus('Please fill in all fields', 'bg-red-100 border border-red-400 text-red-700');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showStatus('Please enter a valid email address', 'bg-red-100 border border-red-400 text-red-700');
            return;
        }

        setLoading(true);

        try {
            // Check if RudderStack is loaded
            if (typeof window.rudderanalytics === 'undefined') {
                throw new Error('RudderStack not loaded');
            }

            // Track the form submission event
            window.rudderanalytics.track('Form Submitted', {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                timestamp: new Date().toISOString(),
                source: 'rudderstack-form'
            });

            // Identify the user with their email
            window.rudderanalytics.identify(formData.email, {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            });

            // Show success message
            showStatus('Form submitted successfully! Your information has been tracked.', 'bg-green-100 border border-green-400 text-green-700');
            
            // Reset form after successful submission
            resetForm();

            // Log to console for debugging
            console.log('Form submitted with data:', formData);

        } catch (error) {
            console.error('Error submitting form:', error);
            showStatus('Error submitting form. Please try again.', 'bg-red-100 border border-red-400 text-red-700');
        } finally {
            setLoading(false);
        }
    });

    // Optional: Track page view when the page loads
    window.addEventListener('load', function() {
        if (typeof window.rudderanalytics !== 'undefined') {
            window.rudderanalytics.page('Form Page', {
                page: 'rudderstack-form',
                timestamp: new Date().toISOString()
            });
        }
    });
});
