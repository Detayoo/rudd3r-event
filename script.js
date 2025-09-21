document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rudderstackForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    const showStatus = (message, type) => {
        statusMessage.textContent = message;
        statusMessage.className = `mt-4 p-3 rounded-md ${type}`;
        statusMessage.classList.remove('hidden');
        
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    };

    const resetForm = () => {
        form.reset();
    };

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

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim()
        };

        if (!formData.fullName || !formData.email || !formData.phoneNumber) {
            showStatus('Please fill in all fields', 'bg-red-100 border border-red-400 text-red-700');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showStatus('Please enter a valid email address', 'bg-red-100 border border-red-400 text-red-700');
            return;
        }

        setLoading(true);

        try {
            if (typeof window.rudderanalytics === 'undefined') {
                throw new Error('RudderStack not loaded');
            }

            window.rudderanalytics.track('Form Submitted', {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                timestamp: new Date().toISOString(),
                source: 'rudderstack-form'
            });

            window.rudderanalytics.identify(formData.email, {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            });

            showStatus('Form submitted successfully! Your information has been tracked.', 'bg-green-100 border border-green-400 text-green-700');
            
            resetForm();

            // console.log('Form submitted with data:', formData);

        } catch (error) {
            console.error('Error submitting form:', error);
            showStatus('Error submitting form. Please try again.', 'bg-red-100 border border-red-400 text-red-700');
        } finally {
            setLoading(false);
        }
    });

    window.addEventListener('load', function() {
        if (typeof window.rudderanalytics !== 'undefined') {
            window.rudderanalytics.page('Form Page', {
                page: 'rudderstack-form',
                timestamp: new Date().toISOString()
            });
        }
    });
});
