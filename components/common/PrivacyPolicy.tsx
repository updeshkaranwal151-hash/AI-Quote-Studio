import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg max-h-48 overflow-y-auto text-sm text-gray-300 border border-gray-700">
      <h3 className="font-bold text-white mb-2">Content and Privacy Policy</h3>
      <p className="mb-2">
        By uploading a quote, you agree to our terms of service and content policy. You retain ownership of your content, but you grant us a license to display it within the app.
      </p>
      <p className="font-semibold text-white mb-1">Prohibited Content:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Hate Speech & Harassment:</strong> Content that promotes violence, incites hatred, promotes discrimination, or disparages on the basis of race or ethnic origin, religion, disability, age, nationality, veteran status, sexual orientation, gender, gender identity, etc.
        </li>
        <li>
          <strong>Sexual Content:</strong> Content containing nudity, graphic sexual acts, or other sexually explicit material is not allowed.
        </li>
        <li>
          <strong>Illegal Activities:</strong> Do not post content that promotes or facilitates illegal activities, such as self-harm, violence, or the sale of regulated goods.
        </li>
        <li>
          <strong>Copyrighted Material:</strong> Only upload content that you have the legal right to share.
        </li>
      </ul>
      <p className="mt-2">
        We reserve the right to remove any content that violates these policies.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
