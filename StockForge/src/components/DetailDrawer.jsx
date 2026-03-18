import { Close, Print } from '@mui/icons-material';

/**
 * Reusable right-side sliding detail drawer.
 *
 * Props:
 *   open       {boolean}
 *   onClose    {() => void}
 *   title      {string}
 *   subtitle   {string=}
 *   theme      {string=}   'purchase' | 'sales' | 'production' | 'raw-materials' | 'finished'
 *   icon       {ReactNode=}
 *   badge      {ReactNode=}  rendered inline next to the title
 *   sections   {Array<{
 *                 title?: string,
 *                 items?: Array<{ label: string, value: ReactNode, mono?: boolean }>,
 *                 table?: {
 *                   columns: Array<{ key: string, label: string, align?: 'left'|'right'|'center' }>,
 *                   rows: Array<Record<string, ReactNode>>
 *                 }
 *               }>}
 *   footer     {ReactNode=}  pinned to the bottom of the scroll area
 *   enablePrint {boolean=}   show print button in header (default: true)
 */
const DetailDrawer = ({
  open,
  onClose,
  title,
  subtitle,
  theme = '',
  icon,
  badge,
  sections = [],
  footer,
  enablePrint = true,
}) => {
  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dd-overlay" onClick={onClose}>
      <div
        className={`dd-panel${theme ? ` dd-theme-${theme}` : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="dd-header">
          <div className="dd-header-left">
            {icon && <div className="dd-icon">{icon}</div>}
            <div>
              <div className="dd-title-row">
                <h2 className="dd-title">{title}</h2>
                {badge && <span className="dd-badge-wrap">{badge}</span>}
              </div>
              {subtitle && <p className="dd-subtitle">{subtitle}</p>}
            </div>
          </div>
          <div className="dd-header-actions">
            {enablePrint && (
              <button className="dd-print" onClick={handlePrint} type="button" aria-label="Print details">
                <Print />
                <span>Print</span>
              </button>
            )}
            <button className="dd-close" onClick={onClose} type="button" aria-label="Close drawer">
              <Close />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────── */}
        <div className="dd-body">
          {sections.map((section, si) => (
            <div key={si} className="dd-section">
              {section.title && (
                <div className="dd-section-title">{section.title}</div>
              )}

              {/* Key-value rows */}
              {section.items && (
                <div className="dd-fields">
                  {section.items.map((item, ii) => (
                    <div key={ii} className="dd-field-row">
                      <span className="dd-field-label">{item.label}</span>
                      <span className={`dd-field-value${item.mono ? ' mono' : ''}`}>
                        {item.value ?? '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Mini items table */}
              {section.table && (
                <table className="dd-items-table">
                  <thead>
                    <tr>
                      {section.table.columns.map((col) => (
                        <th key={col.key} style={{ textAlign: col.align || 'left' }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={section.table.columns.length}
                          style={{ textAlign: 'center', color: '#94a3b8', padding: '14px 10px' }}
                        >
                          No items
                        </td>
                      </tr>
                    ) : (
                      section.table.rows.map((row, ri) => (
                        <tr key={ri}>
                          {section.table.columns.map((col) => (
                            <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                              {row[col.key] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ))}

          {footer && <div className="dd-footer-inner">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
