package com.simtech.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simtech.dao.TempUserRegistrationRepository;
import com.simtech.entity.TempUserRegistration;

@Service
public class TempUserCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(TempUserCleanupService.class);

    @Autowired
    private TempUserRegistrationRepository tempUserRegistrationRepository;

    /**
     * Scheduled task to clean up expired temporary user registrations
     * Runs every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    @Transactional
    public void cleanupExpiredRegistrations() {
        logger.info("Starting cleanup of expired temporary user registrations");

        // Delete records older than 24 hours
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, -24);
        Date expiryTime = cal.getTime();

        List<TempUserRegistration> expiredRegistrations = tempUserRegistrationRepository.findByCreatedTimeBefore(expiryTime);

        if (!expiredRegistrations.isEmpty()) {
            logger.info("Found {} expired temporary registrations to clean up", expiredRegistrations.size());
            tempUserRegistrationRepository.deleteAll(expiredRegistrations);
            logger.info("Cleanup completed successfully");
        } else {
            logger.info("No expired temporary registrations found");
        }

        // Also delete records with no activity in the last 3 hours
        cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, -3);
        Date inactivityTime = cal.getTime();

        List<TempUserRegistration> inactiveRegistrations = tempUserRegistrationRepository.findByLastActivityTimeBefore(inactivityTime);

        if (!inactiveRegistrations.isEmpty()) {
            logger.info("Found {} inactive temporary registrations to clean up", inactiveRegistrations.size());
            tempUserRegistrationRepository.deleteAll(inactiveRegistrations);
            logger.info("Inactive registrations cleanup completed successfully");
        }
    }
}