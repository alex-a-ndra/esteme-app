package com.esteme.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Benefit.
 */
@Entity
@Table(name = "benefit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Benefit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "benefit_is_used_by",
               joinColumns = @JoinColumn(name = "benefit_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "is_used_by_id", referencedColumnName = "id"))
    private Set<User> isUsedBies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Benefit name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getIsUsedBies() {
        return isUsedBies;
    }

    public Benefit isUsedBies(Set<User> users) {
        this.isUsedBies = users;
        return this;
    }

    public Benefit addIsUsedBy(User user) {
        this.isUsedBies.add(user);
        return this;
    }

    public Benefit removeIsUsedBy(User user) {
        this.isUsedBies.remove(user);
        return this;
    }

    public void setIsUsedBies(Set<User> users) {
        this.isUsedBies = users;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Benefit)) {
            return false;
        }
        return id != null && id.equals(((Benefit) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Benefit{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
