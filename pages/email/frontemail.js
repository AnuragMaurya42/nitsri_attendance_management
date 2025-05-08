import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailScraper() {
  const [website, setWebsite] = useState('');
  const [name, setName] = useState('');
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmails([]);
    setPhones([]);
    setError('');
    setSearchQuery('');
    setLoading(true);

    try {
      const res = await axios.post('/api/email/scrape_email', { website, name });
      setEmails(res.data.emails || []);
      setPhones(res.data.phones || []);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to fetch data. Please check the URL or try again.');
    }

    setLoading(false);
  };

  const filteredEmails = emails.filter(email =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPhones = phones.filter(phone =>
    phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-blue-700"
      >
        🔎 Contact Scraper
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 bg-white shadow p-6 rounded-lg border"
      >
        <div>
          <label className="block mb-1 font-semibold">Website URL<span className="text-red-500">*</span></label>
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Name Filter (optional)</label>
          <input
            type="text"
            placeholder="e.g., John, Admissions"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Scraping...' : 'Start Scraping'}
        </button>
      </motion.form>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center mt-6"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {(emails.length > 0 || phones.length > 0) && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="🔍 Search by name/email/number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />
        </div>
      )}

      <AnimatePresence>
        {!loading && (filteredEmails.length > 0 || filteredPhones.length > 0) && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-4 rounded shadow"
          >
            {filteredEmails.length > 0 && (
              <>
                <motion.h2 className="text-xl font-semibold mb-2 text-green-700">
                  📧 Emails Found:
                </motion.h2>
                <ul className="list-disc list-inside space-y-1">
                  {filteredEmails.map((email, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {email}
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
            {filteredPhones.length > 0 && (
              <>
                <motion.h2 className="text-xl font-semibold mt-4 mb-2 text-green-700">
                  📱 Phone Numbers Found:
                </motion.h2>
                <ul className="list-disc list-inside space-y-1">
                  {filteredPhones.map((phone, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {phone}
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
            {filteredEmails.length === 0 && filteredPhones.length === 0 && (
              <p className="text-gray-500 mt-4">No match found for &quot;{searchQuery}&quot;.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
