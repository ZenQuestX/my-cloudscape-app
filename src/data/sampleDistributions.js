// Helper to generate random data
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - getRandomInt(0, 30));
    return date.toISOString().split('T')[0];
};

// Base data
const baseData = [
    { id: 'BLUDPSDMUFA100', state: 'Activated', domainName: '021345abcdef6789.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'CDUKONPMNPK126', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'CIRTXERTVJCC57', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'DGIOUGXEYKSV24', state: 'Activated', domainName: '021345abcdef6789.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'E2JKRO77FTEJCP', state: 'Activated', domainName: '021345abcdef6789.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'EDERQONFTUVY61', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'FEXGHMXJSHB129', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'F5KPXFYLAJAS56', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'FUHHWNPTYCP137', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'GFJKMACVEUFO27', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'HJKHUFOXRNC64', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'HRRFXXSLARVI31', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'IKGKHR0FVJN145', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'JBYKRGXASHR58', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'JKKMKSLATDTO58', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'JVHQACDNCTS175', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'LCHDBYHMKQ106', state: 'Activated', domainName: '021345abcdef6789.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'LGELJXYBJNF27', state: 'Activated', domainName: '021345abcdef6789.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'LIKTDCCSLKSQ45', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'LPKNMWSVAQKBQ51', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'NBAPRROUXID93', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'OFISBOWGHK140', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'PDHLSJKLRLG98', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'QFCJLAEWVCUF28', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'QNHKPNCQDHNG36', state: 'Activated', domainName: '021345abcdef6789.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'QNSXSKWLPULQ47', state: 'Activated', domainName: 'abcdef01234567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'QQLIOKRPLRJB95', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'QPYEXYVGJRF119', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
    { id: 'QTWOAEMDEUI148', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'QVEJN3SOPYB102', state: 'Activated', domainName: '1234abcdefg567890.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    // Additional items with different states
    { id: 'RTMP001XYZ', state: 'Deactivated', domainName: 'rtmp-example.cloudfront...', deliveryMethod: 'RTMP', sslCertificate: 'Default' },
    { id: 'RTMP002ABC', state: 'Pending', domainName: 'rtmp-pending.cloudfront...', deliveryMethod: 'RTMP', sslCertificate: 'Custom' },
    { id: 'WEB003DEF', state: 'Deactivated', domainName: 'web-deactivated.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Default' },
    { id: 'WEB004GHI', state: 'Pending', domainName: 'web-pending.cloudfront...', deliveryMethod: 'Web', sslCertificate: 'Custom' },
];

// Add extra data types (Number, Boolean, Date)
export const sampleDistributions = baseData.map(item => ({
    ...item,
    requests: getRandomInt(1000, 10000),
    logging: Math.random() > 0.5,
    lastModified: getRandomDate(),
}));

// Filter property definitions for PropertyFilter component
export const filteringProperties = [
    {
        key: 'id',
        propertyLabel: 'Distribution ID',
        groupValuesLabel: 'Distribution ID values',
        operators: [':', '!:', '=', '!='],
    },
    {
        key: 'state',
        propertyLabel: 'State',
        groupValuesLabel: 'State values',
        operators: ['=', '!='],
    },
    {
        key: 'domainName',
        propertyLabel: 'Domain name',
        groupValuesLabel: 'Domain name values',
        operators: [':', '!:', '=', '!='],
    },
    {
        key: 'deliveryMethod',
        propertyLabel: 'Delivery method',
        groupValuesLabel: 'Delivery method values',
        operators: ['=', '!='],
    },
    {
        key: 'sslCertificate',
        propertyLabel: 'SSL certificate',
        groupValuesLabel: 'SSL certificate values',
        operators: ['=', '!='],
    },
    {
        key: 'requests',
        propertyLabel: 'Requests',
        groupValuesLabel: 'Request values',
        operators: ['=', '!=', '>', '>=', '<', '<='], // Number operators
    },
    {
        key: 'logging',
        propertyLabel: 'Logging',
        groupValuesLabel: 'Logging values',
        operators: ['='], // Boolean comparison
    },
    {
        key: 'lastModified',
        propertyLabel: 'Last Modified',
        groupValuesLabel: 'Last Modified values',
        operators: ['=', '!=', '>', '>=', '<', '<='], // Date comparison
    },
];

// Column definitions for Table component
export const columnDefinitions = [
    {
        id: 'id',
        header: 'Distribution ID',
        cell: item => item.id,
        sortingField: 'id',
        isRowHeader: true,
    },
    {
        id: 'state',
        header: 'State',
        cell: item => item.state,
        sortingField: 'state',
    },
    {
        id: 'domainName',
        header: 'Domain name',
        cell: item => item.domainName,
        sortingField: 'domainName',
    },
    {
        id: 'deliveryMethod',
        header: 'Delivery method',
        cell: item => item.deliveryMethod,
        sortingField: 'deliveryMethod',
    },
    {
        id: 'requests',
        header: 'Requests',
        cell: item => item.requests.toLocaleString(), // Number formatting
        sortingField: 'requests',
    },
    {
        id: 'logging',
        header: 'Logging',
        cell: item => item.logging ? 'Enabled' : 'Disabled',
        sortingField: 'logging',
    },
    {
        id: 'lastModified',
        header: 'Last Modified',
        cell: item => item.lastModified,
        sortingField: 'lastModified',
    },
    {
        id: 'sslCertificate',
        header: 'SSL certificate',
        cell: item => item.sslCertificate,
        sortingField: 'sslCertificate',
    },
];
