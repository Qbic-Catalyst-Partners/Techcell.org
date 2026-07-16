package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
// Add this method to the repository
    List<Payment> findByUserDetailUserIdAndStatusOrderByTractiondateDesc(Long userId, String status);
}