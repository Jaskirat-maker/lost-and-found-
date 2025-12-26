package edu.college.lostfound.repository;

import edu.college.lostfound.entity.Item;
import edu.college.lostfound.enums.ItemStatus;
import edu.college.lostfound.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Item> findByStatusAndTypeOrderByCreatedAtDesc(ItemStatus status, ItemType type);

    @Query("""
            select i from Item i
            where (:status is null or i.status = :status)
              and (:type is null or i.type = :type)
            order by i.createdAt desc
            """)
    List<Item> adminSearch(@Param("status") ItemStatus status, @Param("type") ItemType type);
}

