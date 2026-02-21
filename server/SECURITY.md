# Security Audit Checklist

Use this checklist to ensure your backend is secure before going to production.

## 🔒 Authentication & Authorization

- [ ] **JWT Secret**
  - [ ] Strong random secret (64+ characters)
  - [ ] Different secret for production
  - [ ] Secret stored in environment variable only
  - [ ] Never committed to git

- [ ] **Password Security**
  - [ ] Bcrypt hashing enabled
  - [ ] Salt rounds >= 10
  - [ ] Password validation (min length, complexity)
  - [ ] No password in responses

- [ ] **Token Management**
  - [ ] Token expiration configured (30d max)
  - [ ] Tokens validated on protected routes
  - [ ] Invalid tokens rejected properly

## 🛡️ Input Validation & Sanitization

- [ ] **Request Validation**
  - [ ] Joi validation on all inputs
  - [ ] Email format validation
  - [ ] String length limits enforced
  - [ ] ObjectId format validation

- [ ] **NoSQL Injection Protection**
  - [ ] express-mongo-sanitize enabled
  - [ ] $ and . characters sanitized
  - [ ] Query parameters validated

- [ ] **XSS Protection**
  - [ ] xss-clean middleware enabled
  - [ ] User input sanitized
  - [ ] HTML entities escaped

## 🚦 Rate Limiting

- [ ] **API Rate Limits**
  - [ ] General API: 100 req/15min
  - [ ] Auth endpoints: 5 req/15min
  - [ ] Message sending: 30 msg/min
  - [ ] File uploads: 50 uploads/hour

- [ ] **Rate Limit Headers**
  - [ ] X-RateLimit-* headers enabled
  - [ ] Proper error messages
  - [ ] No info leakage in errors

## 🔐 Security Headers

- [ ] **Helmet Configuration**
  - [ ] Content-Security-Policy set
  - [ ] X-Frame-Options enabled
  - [ ] X-Content-Type-Options enabled
  - [ ] Strict-Transport-Security configured

## 🌐 CORS Configuration

- [ ] **Origin Control**
  - [ ] Whitelist configured
  - [ ] No wildcard (*) in production
  - [ ] Credentials enabled properly
  - [ ] Preflight requests handled

## 📁 File Upload Security

- [ ] **File Validation**
  - [ ] File type validation
  - [ ] File size limits (10MB max)
  - [ ] Malicious file detection
  - [ ] Filename sanitization

- [ ] **Storage Security**
  - [ ] Cloudinary for production
  - [ ] Local uploads not in git
  - [ ] Upload directory permissions set
  - [ ] File URL validation

## 🗄️ Database Security

- [ ] **MongoDB Configuration**
  - [ ] MongoDB Atlas with auth
  - [ ] IP whitelist configured
  - [ ] Strong database password
  - [ ] Connection string in env only

- [ ] **Query Security**
  - [ ] No direct queries from client
  - [ ] Input sanitization
  - [ ] Proper error handling
  - [ ] No sensitive data in logs

## 🌍 Environment Variables

- [ ] **Configuration**
  - [ ] .env not in git
  - [ ] .env.example provided
  - [ ] All secrets in environment
  - [ ] Production values different

- [ ] **Validation**
  - [ ] Joi schema validation
  - [ ] Required vars checked on startup
  - [ ] Default values for non-sensitive

## 📊 Logging & Monitoring

- [ ] **Request Logging**
  - [ ] Morgan configured
  - [ ] No sensitive data logged
  - [ ] Production logs secure
  - [ ] Log rotation configured

- [ ] **Error Logging**
  - [ ] Stack traces in dev only
  - [ ] Generic errors in production
  - [ ] Critical errors monitored
  - [ ] Error tracking setup

## 🔄 Error Handling

- [ ] **Custom Errors**
  - [ ] AppError classes used
  - [ ] Proper status codes
  - [ ] No stack traces leaked
  - [ ] Async errors handled

- [ ] **Error Responses**
  - [ ] Consistent format
  - [ ] No sensitive info exposed
  - [ ] Proper HTTP codes
  - [ ] User-friendly messages

## 🚪 Socket.IO Security

- [ ] **Connection Security**
  - [ ] Authentication middleware
  - [ ] CORS configured
  - [ ] Origin validation
  - [ ] Connection limits

- [ ] **Event Security**
  - [ ] Input validation on events
  - [ ] Rate limiting per socket
  - [ ] Proper room management
  - [ ] Disconnect handling

## 🔧 Dependencies

- [ ] **Package Security**
  - [ ] npm audit run
  - [ ] No critical vulnerabilities
  - [ ] Dependencies up to date
  - [ ] Only production deps in prod

- [ ] **Package.json**
  - [ ] Lock file committed
  - [ ] Scripts secure
  - [ ] No unnecessary packages

## 🚀 Deployment

- [ ] **Environment**
  - [ ] NODE_ENV=production
  - [ ] Process manager (PM2)
  - [ ] Auto-restart configured
  - [ ] Log management

- [ ] **Server Security**
  - [ ] HTTPS enabled
  - [ ] SSL certificate valid
  - [ ] Firewall configured
  - [ ] SSH key auth only

- [ ] **Reverse Proxy**
  - [ ] Nginx/Apache configured
  - [ ] Proper headers set
  - [ ] Rate limiting at proxy
  - [ ] DDoS protection

## 🔍 Testing

- [ ] **Security Tests**
  - [ ] Auth flows tested
  - [ ] Input validation tested
  - [ ] Error handling tested
  - [ ] Rate limits tested

- [ ] **Penetration Testing**
  - [ ] SQL/NoSQL injection attempts
  - [ ] XSS attempts
  - [ ] CSRF protection tested
  - [ ] Authentication bypass attempts

## 📋 Documentation

- [ ] **Code Documentation**
  - [ ] README complete
  - [ ] API endpoints documented
  - [ ] Security practices noted
  - [ ] Deployment guide ready

- [ ] **Security Policies**
  - [ ] Password policy documented
  - [ ] Data retention policy
  - [ ] Incident response plan
  - [ ] Backup strategy

## ✅ Pre-Production Final Check

Run these commands before deploying:

```bash
# 1. Security audit
npm audit

# 2. Check for hardcoded secrets
grep -r "mongodb://" --exclude-dir=node_modules .
grep -r "jwt_secret" --exclude-dir=node_modules .

# 3. Verify environment
cat .env | grep -v "^#" | grep "="

# 4. Test health endpoint
curl http://localhost:5000/api/health

# 5. Check logs for errors
tail -f logs/app.log
```

## 🚨 Security Incident Response

If a security issue is discovered:

1. **Immediate Actions**
   - [ ] Assess the severity
   - [ ] Document the issue
   - [ ] Notify stakeholders
   - [ ] Begin mitigation

2. **Short-term Actions**
   - [ ] Patch the vulnerability
   - [ ] Deploy fix to production
   - [ ] Verify fix effectiveness
   - [ ] Monitor for exploit attempts

3. **Long-term Actions**
   - [ ] Review similar code
   - [ ] Update security practices
   - [ ] Document lessons learned
   - [ ] Improve testing

## 📱 Contact

For security issues:
- Email: security@yourdomain.com
- Report privately, not in public issues

## 🔄 Regular Security Maintenance

Perform these tasks regularly:

**Weekly:**
- [ ] Review application logs
- [ ] Check for failed login attempts
- [ ] Monitor rate limit hits

**Monthly:**
- [ ] npm audit and updates
- [ ] Review access logs
- [ ] Check SSL certificate expiry
- [ ] Review user permissions

**Quarterly:**
- [ ] Security training
- [ ] Penetration testing
- [ ] Policy review
- [ ] Backup testing

---

**Last Updated:** [Date]  
**Reviewed By:** [Name]  
**Next Review:** [Date]

---

## 🎯 Security Score

Track your compliance:

- [ ] **Basic** (60%+): Essential protections in place
- [ ] **Intermediate** (80%+): Strong security posture
- [ ] **Advanced** (95%+): Production-ready security
- [ ] **Enterprise** (100%): Maximum security

**Current Score:** _____ / 100%

---

Keep this checklist updated and review it before each major deployment!
