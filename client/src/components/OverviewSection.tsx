import { motion } from 'framer-motion';
import { Users, Building2, Globe, FileText, Scale, AlertCircle } from 'lucide-react';
import { parties, caseInfo, caseSections } from '@/data/caseData';

// Overview Section - Olive Branch Justice Theme
// Features: Parties info, case summary, key sections

export default function OverviewSection() {
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
                  Plaintiff
                </span>
                <h3 
                  className="text-xl font-bold text-[#3d3d3d]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {parties.plaintiff.name}
                </h3>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-[#3d3d3d]/80">
                <span className="font-semibold">Representative:</span> {parties.plaintiff.representative}
              </p>
              <p className="text-[#3d3d3d]/80">
                <span className="font-semibold">Role:</span> {parties.plaintiff.role}
              </p>
              <p className="text-[#3d3d3d]/60 text-xs">
                {parties.plaintiff.details}
              </p>
            </div>
          </motion.div>

          {/* Defendant */}
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
                  Defendant
                </span>
                <h3 
                  className="text-xl font-bold text-[#3d3d3d]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {parties.defendant.name}
                </h3>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-[#3d3d3d]/80">
                <span className="font-semibold">Representative:</span> {parties.defendant.representative}
              </p>
              <p className="text-[#3d3d3d]/80">
                <span className="font-semibold">Role:</span> {parties.defendant.role}
              </p>
              <p className="text-[#3d3d3d]/60 text-xs">
                {parties.defendant.details}
              </p>
            </div>
          </motion.div>

          {/* International Parties */}
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
              {parties.international.map((party, index) => (
                <div key={index} className="text-sm border-l-2 border-[#c4a35a]/30 pl-4">
                  <p className="font-semibold text-[#3d3d3d]">{party.name}</p>
                  <p className="text-[#3d3d3d]/70 text-xs">{party.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Case Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 
            className="text-2xl font-bold text-[#3d3d3d] mb-8 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Key Case Elements
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl p-6 border border-[#c4a35a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-[#5d6d4e]" />
                <h4 className="font-semibold text-[#3d3d3d]">Project Information</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-[#3d3d3d]/60">Project Name:</span> <span className="font-medium">{caseInfo.projectName}</span></p>
                <p><span className="text-[#3d3d3d]/60">Description:</span> <span className="font-medium">{caseInfo.projectDescription}</span></p>
                <p><span className="text-[#3d3d3d]/60">License No:</span> <span className="font-mono text-xs">{caseInfo.licenseNumber}</span></p>
                <p><span className="text-[#3d3d3d]/60">License Date:</span> <span className="font-medium">{caseInfo.licenseDate}</span></p>
              </div>
            </div>

            {/* Financial Info */}
            <div className="bg-white rounded-xl p-6 border border-[#c4a35a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-[#722f37]" />
                <h4 className="font-semibold text-[#3d3d3d]">Financial Details</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-[#3d3d3d]/60">Guarantee Value:</span> <span className="font-bold text-[#5d6d4e]">{caseInfo.guaranteeValue}</span></p>
                <p><span className="text-[#3d3d3d]/60">Deal Value Lost:</span> <span className="font-bold text-[#722f37]">{caseInfo.dealValue}</span></p>
                <p><span className="text-[#3d3d3d]/60">Guarantee Ref:</span> <span className="font-mono text-xs break-all">{caseInfo.guaranteeNumber}</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Case Sections Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 
            className="text-2xl font-bold text-[#3d3d3d] mb-8 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Case Structure (20 Points)
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {caseSections.slice(0, 8).map((section) => (
              <motion.div
                key={section.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-[#fdfcfa] to-[#f5f2eb] rounded-lg p-4 border border-[#c4a35a]/20 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#5d6d4e] text-white text-xs flex items-center justify-center font-bold">
                    {section.id}
                  </span>
                  <h4 className="text-sm font-semibold text-[#3d3d3d] line-clamp-1">
                    {section.title}
                  </h4>
                </div>
                <p className="text-xs text-[#3d3d3d]/60 line-clamp-2">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <a 
              href="#timeline" 
              className="inline-flex items-center gap-2 text-[#5d6d4e] hover:text-[#722f37] transition-colors text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              View complete timeline with all 20 sections
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
