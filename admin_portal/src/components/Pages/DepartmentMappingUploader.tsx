import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { userDb } from '../../config/firebase';

// Sample department mappings
const DEPARTMENT_MAPPINGS = [
    // Ranchi
    { city: 'Ranchi', category: 'pothole', pincode: '834001', department: 'Ranchi Municipal Corporation - Roads & PWD', higher_authority: 'Executive Engineer - RMC Roads Department' },
    { city: 'Ranchi', category: 'garbage_dump', pincode: '834001', department: 'Ranchi Municipal Corporation - Solid Waste Management', higher_authority: 'Chief Sanitation Officer - RMC' },
    { city: 'Ranchi', category: 'water_leakage', pincode: '834001', department: 'Ranchi Municipal Corporation - Water Supply', higher_authority: 'Superintendent Engineer - Water Supply' },
    { city: 'Ranchi', category: 'broken_streetlight', pincode: '834001', department: 'Ranchi Municipal Corporation - Electrical Department', higher_authority: 'Executive Engineer - Electrical' },
    { city: 'Ranchi', category: 'open_manhole', pincode: '834001', department: 'Ranchi Municipal Corporation - Drainage & Sewerage', higher_authority: 'Executive Engineer - Drainage' },
    { city: 'Ranchi', category: 'damaged_road', pincode: '834001', department: 'Ranchi Municipal Corporation - Roads & PWD', higher_authority: 'Executive Engineer - RMC Roads Department' },
    { city: 'Ranchi', category: 'sanitation', pincode: '834001', department: 'Ranchi Municipal Corporation - Public Health', higher_authority: 'Medical Officer of Health - RMC' },
    { city: 'Ranchi', category: 'electricity', pincode: '834001', department: 'Jharkhand State Electricity Board - Ranchi', higher_authority: 'Superintending Engineer - JSEB Ranchi' },

    // Delhi
    { city: 'Delhi', category: 'pothole', pincode: '110001', department: 'Delhi Municipal Corporation - Roads Department', higher_authority: 'Executive Engineer - DMC Roads' },
    { city: 'Delhi', category: 'garbage_dump', pincode: '110001', department: 'Delhi Municipal Corporation - Sanitation', higher_authority: 'Chief Sanitation Inspector - DMC' },
    { city: 'Delhi', category: 'water_leakage', pincode: '110001', department: 'Delhi Jal Board', higher_authority: 'Executive Engineer - DJB' },
    { city: 'Delhi', category: 'broken_streetlight', pincode: '110001', department: 'Delhi Municipal Corporation - Electrical', higher_authority: 'Executive Engineer - DMC Electrical' },
    { city: 'Delhi', category: 'open_manhole', pincode: '110001', department: 'Delhi Municipal Corporation - Drainage', higher_authority: 'Executive Engineer - DMC Drainage' },
    { city: 'Delhi', category: 'damaged_road', pincode: '110001', department: 'Delhi Municipal Corporation - Roads Department', higher_authority: 'Executive Engineer - DMC Roads' },
    { city: 'Delhi', category: 'sanitation', pincode: '110001', department: 'Delhi Municipal Corporation - Health', higher_authority: 'Medical Officer - DMC' },
    { city: 'Delhi', category: 'electricity', pincode: '110001', department: 'BSES Rajdhani Power Limited', higher_authority: 'Divisional Engineer - BRPL' },
];

const DepartmentMappingUploader: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, message]);
    };

    const uploadMappings = async () => {
        setUploading(true);
        setProgress(0);
        setSuccessCount(0);
        setErrorCount(0);
        setLogs([]);

        addLog(`📁 Starting upload of ${DEPARTMENT_MAPPINGS.length} department mappings...`);

        for (let i = 0; i < DEPARTMENT_MAPPINGS.length; i++) {
            const mapping = DEPARTMENT_MAPPINGS[i];

            try {
                // Create unique doc ID
                const cleanCity = mapping.city.replace(/[^a-zA-Z0-9]/g, '_');
                const cleanCategory = mapping.category.replace(/[^a-zA-Z0-9]/g, '_');
                const docId = `${cleanCity}_${cleanCategory}`;

                // Upload to Firestore
                const docRef = doc(userDb, 'civic_issues', docId);
                await setDoc(docRef, {
                    ...mapping,
                    status: 'active',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });

                setSuccessCount(prev => prev + 1);
                addLog(`✅ [${i + 1}/${DEPARTMENT_MAPPINGS.length}] ${mapping.city} - ${mapping.category}`);
            } catch (error) {
                setErrorCount(prev => prev + 1);
                addLog(`❌ Error: ${mapping.city} - ${mapping.category} - ${error instanceof Error ? error.message : 'Unknown error'}`);
            }

            setProgress(((i + 1) / DEPARTMENT_MAPPINGS.length) * 100);
        }

        addLog(`\n🎉 Upload completed!`);
        addLog(`✅ Success: ${successCount + 1}`);
        addLog(`❌ Errors: ${errorCount}`);
        setUploading(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900">Department Mapping Uploader</h1>
                <p className="text-gray-600 mt-2">
                    Upload department mappings to enable location-based routing
                </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Upload</h3>
                        <p className="text-sm text-gray-600">
                            {DEPARTMENT_MAPPINGS.length} department mappings ready to upload
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="text-sm">
                                <span className="font-medium">Cities:</span> Ranchi, Delhi
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Categories per city:</span> 8
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={uploadMappings}
                        disabled={uploading}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${uploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload Department Mappings'}
                    </button>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600">
                                Progress: {Math.round(progress)}% ({successCount} success, {errorCount} errors)
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Logs */}
            {logs.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Logs</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div className="font-mono text-xs space-y-1">
                            {logs.map((log, index) => (
                                <div key={index} className={
                                    log.startsWith('✅') ? 'text-green-600' :
                                        log.startsWith('❌') ? 'text-red-600' :
                                            log.startsWith('🎉') ? 'text-blue-600 font-bold' :
                                                'text-gray-700'
                                }>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentMappingUploader;
