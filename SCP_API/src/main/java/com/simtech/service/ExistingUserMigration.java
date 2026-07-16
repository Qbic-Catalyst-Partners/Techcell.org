package com.simtech.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.simtech.dao.UserRepository;
import com.simtech.entity.UserDetail;

//@Component
public class ExistingUserMigration implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create the date in a way that keeps it effectively final
        final Date paymentIntegrationDate = getPaymentIntegrationDate();

        // Find all users who registered before payment integration
        List<UserDetail> existingUsers = userRepository.findAll((root, query, cb) ->
                cb.lessThan(root.get("effectiveDate"), paymentIntegrationDate)
        );

        // Update payment status for existing users
        for (UserDetail userDetail : existingUsers) {
            if (!userDetail.isPaymentReceived()) {
                userDetail.setPaymentReceived(true);
                if (userDetail.isOtpVerified()) {
                    userDetail.setStatus("Active");
                }
                userRepository.save(userDetail);
            }
        }
    }

    private Date getPaymentIntegrationDate() {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            return sdf.parse("2025-04-01"); // Replace with your actual date
        } catch (ParseException e) {
            // Default to current date if parse fails
            e.printStackTrace();
            return new Date();
        }
    }
}