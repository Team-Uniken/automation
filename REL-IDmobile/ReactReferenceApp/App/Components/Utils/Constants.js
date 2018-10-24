 
  /* Constant file use to declare constants.
 */
module.exports = {
  CHLNG_VERIFICATION_MODE: 0,
  DEVICE_DELETE : "Delete",
  DEVICE_QUEUED_DELETE : "Queued for deleting...",
  DEVICE_ACTIVE : "Active",
  DEVICE_UPDATE : "Update",
  USER_SESSION : "NO", 
  USER_T0:"NO",
  PRIVACY_POLICY_LINK:'http://demos.uniken.com/privacy'
}; 

const JSONKey = module.exports.JSONKey ={
  ENCRIPTED_PATTERN_PASSWORD : 'ERPattern'
}

const errorInfo = module.exports.errorInfo ={
  null : 'Something went wrong, please try again.',
  0	: '',   /* RDNA_ERR_NONE = 0,   No Error */
  1	: '',   /* RDNA_ERR_NOT_INITIALIZED,   If core not initialized */
  2	: '',   /* RDNA_ERR_GENERIC_ERROR,   If generic error occured */
  3	: '',   /* RDNA_ERR_INVALID_VERSION,   If invalid SDK Version */
  4	: '',   /* RDNA_ERR_INVALID_ARGS,   If invalid args are passed */
  5	: '',   /* RDNA_ERR_SESSION_EXPIRED,   If session has expired */
  6	: '',   /* RDNA_ERR_PARENT_PROXY_CONNECT_FAILED,   If failed to connect to proxy server */
  7	: '',   /* RDNA_ERR_NULL_CALLBACKS,   If Null callback/ptr passed in */
  8	: '',   /* RDNA_ERR_INVALID_HOST,   If Null or empty hostname/IP */
  9	: '',   /* RDNA_ERR_INVALID_PORTNUM,   If Invalid port number */
  10	: 'Invalid profile, please try again',   /* RDNA_ERR_INVALID_AGENT_INFO,   If agent info is invalid */
  11	: '',   /* RDNA_ERR_FAILED_TO_CONNECT_TO_SERVER,   If failed to connect to server */
  12	: '',   /* RDNA_ERR_INVALID_SAVED_CONTEXT,   If Invalid saved context */
  13	: '',   /* RDNA_ERR_INVALID_HTTP_REQUEST,   If Invalid HTTP request */
  14	: '',   /* RDNA_ERR_INVALID_HTTP_RESPONSE,   If Invalid HTTP response */
  15	: '',   /* RDNA_ERR_INVALID_CIPHERSPECS,   If cipherspecs is invalid */
  16	: '',   /* RDNA_ERR_SERVICE_NOT_SUPPORTED,   If service not supported */
  17	: '',   /* RDNA_ERR_FAILED_TO_GET_STREAM_PRIVACYSCOPE,   If failed to get stream privacy scope */
  18	: '',   /* RDNA_ERR_FAILED_TO_GET_STREAM_TYPE,   If failed to get stream type */
  19	: '',   /* RDNA_ERR_FAILED_TO_WRITE_INTO_STREAM,   If failed to write into data stream */
  20	: '',   /* RDNA_ERR_FAILED_TO_END_STREAM,   If failed to end stream */
  21	: '',   /* RDNA_ERR_FAILED_TO_DESTROY_STREAM,   If failed to destroy stream */
  22	: '',   /* RDNA_ERR_FAILED_TO_INITIALIZE,   If failed to initialize */
  23	: '',   /* RDNA_ERR_FAILED_TO_PAUSERUNTIME,   If failed to pause runtime */
  24	: '',   /* RDNA_ERR_FAILED_TO_RESUMERUNTIME,   If failed to resume runtime */
  25	: '',   /* RDNA_ERR_FAILED_TO_TERMINATE,   If failed to terminate */
  26	: '',   /* RDNA_ERR_FAILED_TO_GET_CIPHERSALT,   If failed to get ciphersalt */
  27	: '',   /* RDNA_ERR_FAILED_TO_GET_CIPHERSPECS,   If failed to get cipherspecs */
  28	: '',   /* RDNA_ERR_FAILED_TO_GET_AGENT_ID,   If failed to get agent id */
  29	: '',   /* RDNA_ERR_FAILED_TO_GET_SESSION_ID,   If failed to get session id */
  30	: '',   /* RDNA_ERR_FAILED_TO_GET_DEVICE_ID,   If failed to get device id */
  31	: '',   /* RDNA_ERR_FAILED_TO_GET_SERVICE,   If failed to get service */
  32	: '',   /* RDNA_ERR_FAILED_TO_START_SERVICE,   If failed to start service */
  33	: '',   /* RDNA_ERR_FAILED_TO_STOP_SERVICE,   If failed to stop service */
  34	: '',   /* RDNA_ERR_FAILED_TO_ENCRYPT_DATA_PACKET,   If failed to encrypt data packet */
  35	: '',   /* RDNA_ERR_FAILED_TO_DECRYPT_DATA_PACKET,   If failed to decrypt data packet */
  36	: '',   /* RDNA_ERR_FAILED_TO_ENCRYPT_HTTP_REQUEST,   If failed to encrypt HTTP request */
  37	: '',   /* RDNA_ERR_FAILED_TO_DECRYPT_HTTP_RESPONSE,   If failed to decrypt HTTP response */
  38	: '',   /* RDNA_ERR_FAILED_TO_CREATE_PRIVACY_STREAM,   If failed to create privacy stream */
  39	: '',   /* RDNA_ERR_FAILED_TO_CHECK_CHALLENGE,   If failed to check challenges */
  40	: '',   /* RDNA_ERR_FAILED_TO_UPDATE_CHALLENGE,   If failed to update challenges */
  41	: '',   /* RDNA_ERR_FAILED_TO_GET_CONFIG,   If failed to get config */
  42	: '',   /* RDNA_ERR_FAILED_TO_GET_ALL_CHALLENGES,   If failed to get all challenges */
  43	: '',   /* RDNA_ERR_FAILED_TO_LOGOFF,   If failed to log off */
  44	: '',   /* RDNA_ERR_FAILED_TO_RESET_CHALLENGE,   If failed to reset challenge */
  45	: '',   /* RDNA_ERR_FAILED_TO_DO_FORGOT_PASSWORD,   If failed to update forgot pass operation */
  46	: '',   /* RDNA_ERR_FAILED_TO_GET_POST_LOGIN_CHALLENGES,   If failed to get post login challenges */
  47	: '',   /* RDNA_ERR_FAILED_TO_GET_REGISTERD_DEVICE_DETAILS,  If failed to get registered device details */
  48	: '',   /* RDNA_ERR_FAILED_TO_UPDATE_DEVICE_DETAILS,   If failed to update registered device details */
  49	: '',   /* RDNA_ERR_FAILED_TO_GET_NOTIFICATIONS,   If failed to get notification from server */
  50	: '',   /* RDNA_ERR_FAILED_TO_UPDATE_NOTIFICATION,   If failed to update notification to server */
  51	: '',   /* RDNA_ERR_FAILED_TO_OPEN_HTTP_CONNECTION,   If any failure occurs while openeing http tunnel(api)*/
  52	: '',   /* RDNA_ERR_SSL_INIT_FAILED,   If SSL init fails*/
  53	: '',   /* RDNA_ERR_SSL_ACTIVITY_FAILED,   If any error occured during ssl in action*/
  54	: '',   /* RDNA_ERR_DNS_FAILED,   If domain name resolution failed*/
  55	: '',   /* RDNA_ERR_NET_DOWN,   If network is down*/
  56	: '',   /* RDNA_ERR_SOCK_TIMEDOUT,   If connect timeout occured*/
  57	: '',   /* RDNA_ERR_DNA_INTERNAL,   Generic DNA (networking library) error*/  
  //  All errors above this are mapped with the internal errors
  
 //   Following error codes are local error codes
 58	: '',   /* RDNA_ERR_FAILED_TO_PARSE_DEVICES,  If parsing the device details failed */
 59	: '',   /* RDNA_ERR_INVALID_CHALLENGE_CONFIG,  If there is any mistake in challenge configuration */
 60	: '',   /* RDNA_ERR_INVALID_HTTP_API_REQ_URL,  If URL in HTTP req is invalid */
 61	: '',   /* RDNA_ERR_NO_MEMORY,*/
 62	: '',   /* RDNA_ERR_INVALID_CONTEXT,*/
 63	: '',   /* RDNA_ERR_CIPHERTEXT_LENGTH_INVALID,*/
 64	: '',   /* RDNA_ERR_CIPHERTEXT_EMPTY,*/
 65	: '',   /* RDNA_ERR_PLAINTEXT_EMPTY,*/
 66	: '',   /* RDNA_ERR_PLAINTEXT_LENGTH_INVALID,*/
 67	: '',   /* RDNA_ERR_USERID_EMPTY,*/
 68	: '',   /* RDNA_ERR_CHALLENGE_EMPTY,*/
 69	: '',   /* RDNA_ERR_FAILED_TO_SERIALIZE_JSON,*/
 70	: '',   /* RDNA_ERR_USECASE_EMPTY,*/
 71	: '',   /* RDNA_ERR_INVALID_SERVICE_NAME*/ 
}
