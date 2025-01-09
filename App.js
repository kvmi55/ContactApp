import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingPhone, setEditingPhone] = useState('');

  const addContact = () => {
    if (newContactName.trim() === '') return;
    const newContactObj = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim() || 'Brak numeru',
    };
    setContacts([...contacts, newContactObj]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const toggleFavorite = (contact) => {
    if (favorites.find((fav) => fav.id === contact.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== contact.id));
    } else {
      setFavorites([...favorites, contact]);
    }
  };

  const deleteContact = (contactId) => {
    setContacts(contacts.filter((contact) => contact.id !== contactId));
    setFavorites(favorites.filter((fav) => fav.id !== contactId));
  };

  const saveContact = (contactId) => {
    if (editingName.trim() === '' || editingPhone.trim().length < 9) return;
    setContacts(
      contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, name: editingName.trim(), phone: editingPhone.trim() }
          : contact
      )
    );
    setEditingContactId(null);
    setEditingName('');
    setEditingPhone('');
  };

  const startEditing = (contact) => {
    setEditingContactId(contact.id);
    setEditingName(contact.name);
    setEditingPhone(contact.phone);
  };

  const filteredContacts = contacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone.includes(search)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const groupContactsByAlphabet = () => {
    const grouped = {};
    filteredContacts.forEach((contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!grouped[firstLetter]) grouped[firstLetter] = [];
      grouped[firstLetter].push(contact);
    });
    return grouped;
  };

  const groupedContacts = groupContactsByAlphabet();
  const letters = Object.keys(groupedContacts).sort();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moje Kontakty</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Wyszukaj kontakt..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.addContactContainer}>
        <TextInput
          style={styles.addInput}
          placeholder="Imię kontaktu"
          value={newContactName}
          onChangeText={setNewContactName}
        />
        <TextInput
          style={styles.addInput}
          placeholder="Numer telefonu (opcjonalne)"
          value={newContactPhone}
          onChangeText={setNewContactPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>Dodaj</Text>
        </TouchableOpacity>
      </View>

      {favorites.length > 0 && (
        <View style={styles.favoriteSection}>
          <Text style={styles.sectionTitle}>Ulubione</Text>
          {favorites.map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <Text style={styles.contactText}>{contact.name} - {contact.phone}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => toggleFavorite(contact)}>
                  <Text style={styles.favoriteButton}>★</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteContact(contact.id)}>
                  <Text style={styles.deleteButton}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <ScrollView style={styles.contactList}>
        {letters.map((letter) => (
          <View key={letter}>
            <Text style={styles.sectionTitle}>{letter}</Text>
            {groupedContacts[letter].map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                {editingContactId === contact.id ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={editingName}
                      onChangeText={setEditingName}
                    />
                    <TextInput
                      style={styles.editInput}
                      value={editingPhone}
                      onChangeText={setEditingPhone}
                      keyboardType="phone-pad"
                    />
                    <TouchableOpacity onPress={() => saveContact(contact.id)}>
                      <Text style={styles.saveButton}>✓</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text style={styles.contactText}>
                      {contact.name} - {contact.phone}
                    </Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity onPress={() => startEditing(contact)}>
                        <Text style={styles.editButton}>✎</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => toggleFavorite(contact)}>
                        <Text style={styles.favoriteButton}>
                          {favorites.find((fav) => fav.id === contact.id) ? '★' : '☆'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteContact(contact.id)}>
                        <Text style={styles.deleteButton}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
  addContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addInput: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favoriteSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  contactList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333333',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    fontSize: 24,
    color: '#F59E0B',
    marginRight: 10,
  },
  deleteButton: {
    fontSize: 24,
    color: '#FF0000',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  editInput: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    marginRight: 10,
    fontSize: 16,
  },
  saveButton: {
    fontSize: 24,
    color: '#4A90E2',
  },
  editButton: {
    fontSize: 24,
    color: '#F59E0B',
    marginRight: 10,
  },
});
