import React, { useState, useEffect } from 'react'
import BreadCrumb from '../../common/breadcrumb/breadCrumb'
import axios from 'axios'
import BASE_URL from '../../../baseConfig/BaseUrl';
import Select from 'react-select';

interface BranchType {
  id: string;
  branch_name: string;
}

interface ServiceType {
  id: string;
  service: string;
}

interface LocationType {
  id: string;
  name: string;
}

interface VendorState {
  vendor_short: string;
  branch_id: string;
  vendor_company: string;
  vendor_mobile: string;
  vendor_email: string;
  vendor_aadhar_no: string;
  vendor_gst_no: string;
  vendor_images: string;
  vendor_aadhar_front: string;
  vendor_aadhar_back: string;
  vendor_aadhar_gst: string;
  vendor_service_no_count: string;
  vendor_branch_no_count: string;
  vendor_area_no_count: string;
  vendor_service_data: string;
  vendor_branch_data: string;
  vendor_area_data: string;
  vendor_ref_name_1: string;
  vendor_ref_name_2: string;
  vendor_ref_mobile_1: string;
  vendor_ref_mobile_2: string;
}

interface VendorBranchType {
  vendor_branch_flat: string;
  vendor_branch_building: string;
  vendor_branch_landmark: string;
  vendor_branch_pincode: string;
  vendor_branch_location: string;
  vendor_branch_city: string;
  vendor_branch_district: string;
  vendor_branch_state: string;
}

const ServiceRequest = () => {
  const BASE_URL_PINCODE = "https://api.v3care.in"; 

  const [vendor, setVendor] = useState<VendorState>({
    vendor_short: "",
    branch_id: "",
    vendor_company: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_aadhar_no: "",
    vendor_gst_no: "",
    vendor_images: "",
    vendor_aadhar_front: "",
    vendor_aadhar_back: "",
    vendor_aadhar_gst: "",
    vendor_service_no_count: "",
    vendor_branch_no_count: "",
    vendor_area_no_count: "",
    vendor_service_data: "",
    vendor_branch_data: "",
    vendor_area_data: "",
    vendor_ref_name_1: "",
    vendor_ref_name_2: "",
    vendor_ref_mobile_1: "",
    vendor_ref_mobile_2: "",
  });

  const [branches, setBranches] = useState<BranchType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [selectedFile3, setSelectedFile3] = useState<File | null>(null);
  const [selectedFile4, setSelectedFile4] = useState<File | null>(null);

  const [test, setTest] = useState<string[]>([]);

  const [vendor_ser_count, setSerCount] = useState(1);
  const [vendor_branc_count, setBrancCount] = useState(1);
  const [vendor_area_count, setAreaCount] = useState(1);

  const useTemplate = { vendor_service: "" };
  const [users, setUsers] = useState([useTemplate]);

  const useTemplate1 = {
    vendor_branch_flat: "",
    vendor_branch_building: "",
    vendor_branch_landmark: "",
    vendor_branch_pincode: "",
    vendor_branch_location: "",
    vendor_branch_city: "",
    vendor_branch_district: "",
    vendor_branch_state: "",
  };
  const [users1, setUsers1] = useState([useTemplate1]);

  const useTemplate2 = { vendor_area: "" };
  const [users2, setUsers2] = useState([useTemplate2]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-branch-out`);
        setBranches(response.data.branch);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-service-out`);
        setServices(response.data.service);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchBranches();
    fetchServices();
  }, []);

  const validateOnlyDigits = (inputtxt: string): boolean => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (
      (name === "vendor_mobile" ||
        name === "vendor_ref_mobile_1" ||
        name === "vendor_ref_mobile_2" ||
        name === "vendor_aadhar_no") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setVendor({ ...vendor, [name]: value });
  };

  const handleServiceChange = (selectedOptions: any) => {
    const selectedServices = selectedOptions ? selectedOptions.map((option: any) => option.label) : [];
    setTest(selectedServices);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = (setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    setFile(null);
  };

  const onChange1 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value } = e.target;
    const updatedUsers = users1.map((user, i) =>
      index === i ? { ...user, [name]: value } : user
    );
    setUsers1(updatedUsers);
  };

  const checkPincode = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      fetch(`${BASE_URL_PINCODE}/api/external/pin/${pincode}`)
        .then((response) => response.json())
        .then((response) => {
          const updatedUsers = [...users1];
          updatedUsers[index] = {
            ...updatedUsers[index],
            vendor_branch_city: response.city,
            vendor_branch_district: response.district,
            vendor_branch_state: response.state
          };
          setUsers1(updatedUsers);
          
          if (response.areas) {
            setLocations(response.areas.map((area: string, idx: number) => ({
              id: idx.toString(),
              name: area
            })));
          }
        })
        .catch(error => {
          console.error("Error fetching pincode data:", error);
         alert("Error fetching location data for this pincode");
        });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      alert("Please fill all required fields");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("vendor_short", vendor.vendor_short);
    data.append("vendor_company", vendor.vendor_company);
    data.append("vendor_mobile", vendor.vendor_mobile);
    data.append("vendor_email", vendor.vendor_email);
    data.append("branch_id", vendor.branch_id);
    data.append("vendor_aadhar_no", vendor.vendor_aadhar_no);
    data.append("vendor_gst_no", vendor.vendor_gst_no);
    data.append("vendor_ref_name_1", vendor.vendor_ref_name_1);
    data.append("vendor_ref_mobile_1", vendor.vendor_ref_mobile_1);
    data.append("vendor_ref_name_2", vendor.vendor_ref_name_2);
    data.append("vendor_ref_mobile_2", vendor.vendor_ref_mobile_2);
    
    if (selectedFile1) data.append("vendor_images", selectedFile1);
    if (selectedFile2) data.append("vendor_aadhar_front", selectedFile2);
    if (selectedFile3) data.append("vendor_aadhar_back", selectedFile3);
    if (selectedFile4) data.append("vendor_aadhar_gst", selectedFile4);
    
    data.append("vendor_area_no_count", vendor_area_count.toString());
    data.append("vendor_service_no_count", vendor_ser_count.toString());
    data.append("vendor_branch_no_count", vendor_branc_count.toString());
    data.append("vendor_service", test.join(", "));

    // Function to append user data to FormData
    const appendUserData = (users: any[], prefix: string) => {
      users.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          data.append(`${prefix}[${index}][${key}]`, user[key]);
        });
      });
    };

    appendUserData(users, "vendor_service_data");
    appendUserData(users1, "vendor_branch_data");
    appendUserData(users2, "vendor_area_data");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-vendor-out`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code == "200") {
        alert(response.data.msg);
        
        setVendor({
          vendor_short: "",
          branch_id: "",
          vendor_company: "",
          vendor_mobile: "",
          vendor_email: "",
          vendor_aadhar_no: "",
          vendor_gst_no: "",
          vendor_images: "",
          vendor_aadhar_front: "",
          vendor_aadhar_back: "",
          vendor_aadhar_gst: "",
          vendor_service_no_count: "",
          vendor_branch_no_count: "",
          vendor_area_no_count: "",
          vendor_service_data: "",
          vendor_branch_data: "",
          vendor_area_data: "",
          vendor_ref_name_1: "",
          vendor_ref_name_2: "",
          vendor_ref_mobile_1: "",
          vendor_ref_mobile_2: "",
        });
        setTest([]);
        setUsers([useTemplate]);
        setUsers1([useTemplate1]);
        setUsers2([useTemplate2]);
        setSelectedFile1(null);
        setSelectedFile2(null);
        setSelectedFile3(null);
        setSelectedFile4(null);
      } else {
        if (response.data.code == "402") {
          alert(response.data.msg);
        } else if (response.data.code == "403") {
          alert(response.data.msg);
        }else if (response.data.code == "400") {
          alert(response.data.msg);
        } else {
          alert(response.data.msg);
        }
      }
    } catch (error) {
      console.error("Error submitting service request:", error);
      alert("Error submitting service request");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: 'lightgray',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'lightgray',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'white',
      zIndex: 10,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'blue' : 'white', 
      color: state.isSelected ? 'black' : 'black', 
      '&:hover': {
        backgroundColor: 'lightgray',
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'blue',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'white',
      '&:hover': {
        backgroundColor: 'darkred',
        color: 'white',
      },
    }),
  };

  return (
    <>
      <div className="mt-2">
        <div className="content">
          <div className="container">
            <div className="fieldset-wizard request-wizard">
              <div className="row">
                <div>
                  <fieldset id="first-field">
                    <div className="card flex-fill mb-0">
                      <div className="card-body">
                        <h5 className="mb-3">Personal Details</h5>
                        <form onSubmit={onSubmit}>
                          <div>
                            <h6 className="mb-3 fs-16 fw-medium">
                              Basic Information
                            </h6>

                            <div className="row">
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      name="vendor_short"
                                      value={vendor.vendor_short}
                                      onChange={onInputChange}
                                    />
                                    <label className="fs-14">
                                      Nick Name{" "}
                                     
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      name="vendor_company"
                                      value={vendor.vendor_company}
                                      onChange={onInputChange}
                                      required
                                    />
                                    <label className="fs-14">
                                      Company{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="tel"
                                      className="form-control"
                                      placeholder=""
                                      minLength={10}
                                      maxLength={10}
                                      name="vendor_mobile"
                                      value={vendor.vendor_mobile}
                                      onChange={onInputChange}
                                      required
                                    />
                                    <label className="fs-14">
                                      Mobile No{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="email"
                                      className="form-control"
                                      placeholder=""
                                      name="vendor_email"
                                      value={vendor.vendor_email}
                                      onChange={onInputChange}
                                      required
                                    />
                                    <label className="fs-14">
                                      Email Address{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="mb-4">
                                  <div className="position-relative">
                                    <label className="fs-12 select-floating-label">
                                      Branch{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <select
                                      name="branch_id"
                                      value={vendor.branch_id}
                                      onChange={onInputChange}
                                      className="form-select w-100 select"
                                      required
                                    >
                                      <option value="">Select</option>
                                      {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                          {branch.branch_name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="tel"
                                      className="form-control"
                                      placeholder=""
                                      minLength={12}
                                      maxLength={12}
                                      name="vendor_aadhar_no"
                                      value={vendor.vendor_aadhar_no}
                                      onChange={onInputChange}
                                      required
                                    />
                                    <label className="fs-14">
                                      Aadhar No{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      name="vendor_gst_no"
                                      value={vendor.vendor_gst_no}
                                      onChange={onInputChange}
                                  
                                    />
                                    <label className="fs-14">
                                      GST No{" "}
                                     
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <h6 className="mb-3 fs-16 fw-medium">
                                Documentation
                              </h6>
                            
                              {/* 1st - Pictures */}
                            <div className='col-md-3'>
                              <div className="mb-3">
                                <label className="form-label d-block">
                                  Please add Pictures
                                </label>
                                <div className="d-flex align-items-center justify-content-center upload-field flex-column">
                                  {selectedFile1 ? (
                                    <div className="selected-file-container">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="file-name">{selectedFile1.name}</span>
                                        <button 
                                          type="button" 
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removeSelectedFile(setSelectedFile1)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="file-upload btn btn-linear-primary h-auto mb-2">
                                        Browse Files
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          onChange={(e) => handleFileChange(e, setSelectedFile1)}
                                          required
                                        />
                                      </div>
                                      <p className="text-center fs-14">
                                        Only .jpg .png file types allowed and file <br />
                                        size must be less than 10 MB
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* 2nd - Aadhar Front */}
                            <div className='col-md-3'>
                              <div className="mb-3">
                                <label className="form-label d-block">
                                  Please add Aadhar Card Front Side
                                </label>
                                <div className="d-flex align-items-center justify-content-center upload-field flex-column">
                                  {selectedFile2 ? (
                                    <div className="selected-file-container">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="file-name">{selectedFile2.name}</span>
                                        <button 
                                          type="button" 
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removeSelectedFile(setSelectedFile2)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="file-upload btn btn-linear-primary h-auto mb-2">
                                        Browse Files
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          onChange={(e) => handleFileChange(e, setSelectedFile2)}
                                          required
                                        />
                                      </div>
                                      <p className="text-center fs-14">
                                        Only .jpg .png file types allowed and file <br />
                                        size must be less than 10 MB
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* 3rd - Aadhar Back */}
                            <div className='col-md-3'>
                              <div className="mb-3">
                                <label className="form-label d-block">
                                  Please add Aadhar Card Back Side
                                </label>
                                <div className="d-flex align-items-center justify-content-center upload-field flex-column">
                                  {selectedFile3 ? (
                                    <div className="selected-file-container">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="file-name">{selectedFile3.name}</span>
                                        <button 
                                          type="button" 
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removeSelectedFile(setSelectedFile3)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="file-upload btn btn-linear-primary h-auto mb-2">
                                        Browse Files
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          onChange={(e) => handleFileChange(e, setSelectedFile3)}
                                          required
                                        />
                                      </div>
                                      <p className="text-center fs-14">
                                        Only .jpg .png file types allowed and file <br />
                                        size must be less than 10 MB
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* 4th - GST Certificate */}
                            <div className='col-md-3'>
                              <div className="mb-3">
                                <label className="form-label d-block">
                                  Please add GST Certificate
                                </label>
                                <div className="d-flex align-items-center justify-content-center upload-field flex-column">
                                  {selectedFile4 ? (
                                    <div className="selected-file-container">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="file-name">{selectedFile4.name}</span>
                                        <button 
                                          type="button" 
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removeSelectedFile(setSelectedFile4)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="file-upload btn btn-linear-primary h-auto mb-2">
                                        Browse Files
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          onChange={(e) => handleFileChange(e, setSelectedFile4)}
                                        />
                                      </div>
                                      <p className="text-center fs-14">
                                        Only .jpg .png file types allowed and file <br />
                                        size must be less than 10 MB
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                              <h6 className="mb-3 fs-16 fw-medium">
                                Collection Reference Details
                              </h6>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      name="vendor_ref_name_1"
                                      value={vendor.vendor_ref_name_1}
                                      onChange={onInputChange}
                                   
                                    />
                                    <label className="fs-14">
                                      Reference Name 1{" "}
                                     
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      name="vendor_ref_name_2"
                                      value={vendor.vendor_ref_name_2}
                                      onChange={onInputChange}
                                    
                                    />
                                    <label className="fs-14">
                                      Reference Name 2{" "}
                                   
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="tel"
                                      className="form-control"
                                      placeholder=""
                                      minLength={10}
                                      maxLength={10}
                                      name="vendor_ref_mobile_1"
                                      value={vendor.vendor_ref_mobile_1}
                                      onChange={onInputChange}
                                  
                                    />
                                    <label className="fs-14">
                                      Reference Mobile No 1{" "}
                                   
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="mb-4">
                                  <div className="form-floating">
                                    <input
                                      type="tel"
                                      className="form-control"
                                      placeholder=""
                                      minLength={10}
                                      maxLength={10}
                                      name="vendor_ref_mobile_2"
                                      value={vendor.vendor_ref_mobile_2}
                                      onChange={onInputChange}
                                     
                                    />
                                    <label className="fs-14">
                                      Reference Mobile No 2{" "}
                                     
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <h6 className="mb-3 fs-16 fw-medium">
                                Service
                              </h6>

                              <div className="col-md-12">
                                <div className="mb-4 ">
                                  <div className="position-relative">
                                    <label className="fs-12 select-floating-label">
                                      Service{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                      isMulti
                                      name="service_id"
                                      options={services.map(service => ({ value: service.id, label: service.service }))}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      onChange={handleServiceChange}
                                      styles={customStyles}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>

                              <h6 className="mb-3 fs-16 fw-medium">
                                Address Details
                              </h6>

                              {users1.map((user, index) => (
                                <React.Fragment key={index}>
                                  <div className="col-md-3">
                                    <div className="mb-4">
                                      <div className="form-floating">
                                        <input
                                          type="tel"
                                          minLength={6}
                                          maxLength={6}
                                          className="form-control"
                                          placeholder=""
                                          name="vendor_branch_pincode"
                                          value={user.vendor_branch_pincode}
                                          onChange={(e) => {
                                            onChange1(e, index);
                                            checkPincode(e, index);
                                          }}
                                          required
                                        />
                                        <label className="fs-14">
                                          Pincode{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-4">
                                      <div className="form-floating">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          name="vendor_branch_city"
                                          value={user.vendor_branch_city}
                                          onChange={(e) => onChange1(e, index)}
                                          readOnly
                                          required
                                        />
                                        <label className="fs-14">
                                          City{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-4">
                                      <div className="form-floating">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          name="vendor_branch_district"
                                          value={user.vendor_branch_district}
                                          onChange={(e) => onChange1(e, index)}
                                          readOnly
                                          required
                                        />
                                        <label className="fs-14">
                                          District{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-4">
                                      <div className="form-floating">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          name="vendor_branch_state"
                                          value={user.vendor_branch_state}
                                          onChange={(e) => onChange1(e, index)}
                                          readOnly
                                          required
                                        />
                                        <label className="fs-14">
                                          State{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="mb-4 ">
                                      <div className="position-relative">
                                        <label className="fs-12 select-floating-label " >
                                          Street/Location/Village{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <select
                                          name="vendor_branch_location"
                                          value={user.vendor_branch_location}
                                          onChange={(e) => onChange1(e, index)}
                                          className="form-select w-100 select"
                                          required
                                        >
                                          <option value="">Select</option>
                                          {locations.map((location) => (
                                            <option key={location.id} value={location.name}>
                                              {location.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-4">
                                      <div className="form-floating">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          name="vendor_branch_flat"
                                          value={user.vendor_branch_flat}
                                          onChange={(e) => onChange1(e, index)}
                                        
                                        />
                                        <label className="fs-14">
                                          House/Flat/Plot{" "}
                                         
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-4">
                                      <div className="form-floating">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          name="vendor_branch_building"
                                          value={user.vendor_branch_building}
                                          onChange={(e) => onChange1(e, index)}
                                     
                                        />
                                        <label className="fs-14">
                                          Apartment/Building{" "}
                                        
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="mb-4">
                                      <div className="form-floating">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder=""
                                          name="vendor_branch_landmark"
                                          value={user.vendor_branch_landmark}
                                          onChange={(e) => onChange1(e, index)}
                                         
                                        />
                                        <label className="fs-14">
                                          Landmark{" "}
                                      
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                          <div className="text-end">
                            <button
                              type="submit"
                              className="btn btn-linear-primary next_btn"
                              disabled={loading}
                            >
                              {loading ? "Submitting..." : "Submit"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServiceRequest

// original code of service request 