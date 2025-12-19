import { motion } from 'framer-motion';
import { Users, Building2, Globe } from 'lucide-react';

// Overview Section - Olive Branch Justice Theme
// Features: Parties info, case summary, key sections

interface Party {
  name: string;
  label?: string;
  representative?: string;
  role?: string;
}

interface ThirdParty {
  name: string;
  label?: string;
  role?: string;
}

interface OverviewSectionProps {
  plaintiff: Party[];
  defendant: Party[];
  thirdParties: ThirdParty[];
}

export default function OverviewSection({ plaintiff, defendant, thirdParties }: OverviewSectionProps) {
  const plaintiffData = plaintiff[0];
  const defendantData = defendant[0];

  return (
    <section id="overview" className="py-20 bg-white">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Case Overview
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#c4a35a] to-transparent mx-auto mb-6" />
          <p className="text-[#3d3d3d]/70 max-w-2xl mx-auto">
            Understanding the parties involved and the nature of the dispute
          </p>
        </motion.div>

        {/* Parties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Plaintiff */}
          {plaintiffData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#5d6d4e]/5 to-[#5d6d4e]/10 rounded-2xl p-8 border border-[#5d6d4e]/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[#5d6d4e] text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#5d6d4e] uppercase tracking-wider">
                    {plaintiffData.label || 'Plaintiff'}
                  </span>
                  <h3 
                    className="text-xl font-bold text-[#3d3d3d]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {plaintiffData.name}
                  </h3>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {plaintiffData.representative && (
                  <p className="text-[#3d3d3d]/80">
                    <span className="font-semibold">Representative:</span> {plaintiffData.representative}
                  </p>
                )}
                {plaintiffData.role && (
                  <p className="text-[#3d3d3d]/80">
                    <span className="font-semibold">Role:</span> {plaintiffData.role}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Defendant */}
          {defendantData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#722f37]/5 to-[#722f37]/10 rounded-2xl p-8 border border-[#722f37]/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[#722f37] text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#722f37] uppercase tracking-wider">
                    {defendantData.label || 'Defendant'}
                  </span>
                  <h3 
                    className="text-xl font-bold text-[#3d3d3d]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {defendantData.name}
                  </h3>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {defendantData.representative && (
                  <p className="text-[#3d3d3d]/80">
                    <span className="font-semibold">Representative:</span> {defendantData.representative}
                  </p>
                )}
                {defendantData.role && (
                  <p className="text-[#3d3d3d]/80">
                    <span className="font-semibold">Role:</span> {defendantData.role}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* International Parties */}
          {thirdParties && thirdParties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#c4a35a]/5 to-[#c4a35a]/10 rounded-2xl p-8 border border-[#c4a35a]/20 md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[#c4a35a] text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#c4a35a] uppercase tracking-wider">
                    International Parties
                  </span>
                  <h3 
                    className="text-xl font-bold text-[#3d3d3d]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Third Parties
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                {thirdParties.map((party, index) => (
                  <div key={index} className="text-sm border-l-2 border-[#c4a35a]/30 pl-4">
                    <p className="font-semibold text-[#3d3d3d]">{party.name}</p>
                    {party.role && (
                      <p className="text-[#3d3d3d]/70 text-xs">{party.role}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
